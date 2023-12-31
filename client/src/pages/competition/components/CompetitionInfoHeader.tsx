import TopNavBarWrapper from "../../../components/TopNavBarWrapper";
import BackBtn from "../../../components/BackBtn";

export default function CompetitionInfoHeader() {
  return (
    <>
      <TopNavBarWrapper>
        <div className="left-content">
          <BackBtn />
          <h4 className="title mb-0">Competition Details</h4>
        </div>
        <div className="mid-content"></div>
        <div className="right-content"></div>
      </TopNavBarWrapper>
    </>
  );
}
