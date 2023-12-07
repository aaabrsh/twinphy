import { useEffect, useState, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { create, get } from "../../services/crud";
import { toast } from "react-toastify";
import PostsContainer from "../home/components/container/PostsContainer";
import CompetitionPostsHeader from "./components/CompetitionPostsHeader";
import ShareModal from "../../components/ShareModal";
import BlinkingLoadingCircles from "../../components/BlinkingLoadingCircles";
import CompetitionInfoCard from "./components/container/CompetitionInfoCard";
import PageLoading from "../../components/PageLoading";
import { usePostStore } from "../../store";
import { getDate } from "../../services/timeAndDate";

export default function CompetitionInfo() {
  const [pageLoading, setPageLoading] = useState(true);
  const [competitionInfo, setCompetitionInfo] = useState<any>({});
  const [competitionName, setCompetitionName] = useState<string>();
  const [postsLoading, setPostsLoading] = useState(false);
  const lastDate = useRef<string | null>(null);
  const lastPostId = useRef<string | null>(null);
  const lastLikesCount = useRef<string | null>(null);
  const postsLoadingRef = useRef(true);
  const posts = usePostStore((state) => state.posts);
  const addToFeed = usePostStore((state) => state.addToFeed);
  const clearPosts = usePostStore((state) => state.clearPosts);
  const [joinLoading, setJoinLoading] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [currentRound, setCurrentRound] = useState<any>();
  const [rounds, setRounds] = useState<any>([]);

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const pageSize = 10;
  const params = useParams();

  useEffect(() => {
    setCompetitionName(params.name);
  }, []);

  useEffect(() => {
    if (competitionName) {
      getBasicInfo(competitionName);
    }
  }, [competitionName]);

  const getBasicInfo = (nameInfo: string) => {
    setPageLoading(true);
    const query: any = {};
    if (queryParams.get("start_date"))
      query.start_date = queryParams.get("start_date");

    if (queryParams.get("end_date"))
      query.end_date = queryParams.get("end_date");

    get("competition/info/" + nameInfo, query)
      .then((res) => {
        setCompetitionInfo(res.data);
        setRounds(res.data?.rounds ?? []);
        setCurrentRound(res.data?.rounds?.[0] ?? null);
        setPageLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e?.response?.data?.message ?? "Error! Couldn't load competition info"
        );
        setPageLoading(false);
      });
  };

  // TODO: show confirmation dialogue

  const leaveCompetition = () => {
    setLeaveLoading(true);
    create("competition/" + competitionInfo._id + "/leave", {})
      .then((res) => {
        toast.success(res.message ?? "Competition Left");
        setCompetitionInfo((i: any) => ({ ...i, competingUser: res.data }));
        setLeaveLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e.response?.data?.message ?? "Error! couldn't leave competition"
        );
        setLeaveLoading(false);
      });
  };

  const joinCompetition = () => {
    setJoinLoading(true);
    create("competition/" + competitionInfo._id + "/join", {})
      .then((res) => {
        toast.success(res.message ?? "Competition joined");
        setCompetitionInfo((i: any) => ({ ...i, competingUser: res.data }));
        setJoinLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e.response?.data?.message ?? "Error! couldn't join competition"
        );
        setJoinLoading(false);
      });
  };

  const payForCompetition = () => {
    setPayLoading(false);
  };

  if (pageLoading) {
    return <PageLoading />;
  }

  return (
    <>
      <CompetitionPostsHeader />

      <div className="page-content min-vh-100">
        <div className="content-inner pt-0">
          <div className="container bottom-content">
            <CompetitionInfoCard
              competition={competitionInfo}
              joinCompetition={joinCompetition}
              payForCompetition={payForCompetition}
              leaveCompetition={leaveCompetition}
              payLoading={payLoading}
              joinLoading={joinLoading}
              leaveLoading={leaveLoading}
            />
          </div>
        </div>
      </div>

      <ShareModal />
    </>
  );
}