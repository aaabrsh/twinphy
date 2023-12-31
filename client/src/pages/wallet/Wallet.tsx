import { useEffect, useState } from "react";
import WalletHeader from "./components/WalletHeader";
import PageLoading from "../../components/PageLoading";
import { create, get } from "../../services/crud";
import { getUserId } from "../../services/auth";
import { toast } from "react-toastify";
import {
  formatResourceURL,
  handleProfileImageError,
} from "../../services/asset-paths";
import { getName } from "../../services/utils";
import { useNavigate } from "react-router-dom";

export default function Wallet() {
  const [walletInfo, setWalletInfo] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [rechargeLoading, setRechargeLoading] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState(0);
  const [paymentPageContent, setPaymentPageContent] = useState<any>();
  const userId = getUserId();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWalletInfo();
  }, []);

  const fetchWalletInfo = () => {
    setPageLoading(true);
    get("wallet/" + userId + "/info")
      .then((res) => {
        setWalletInfo(res.data);
        setPageLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e?.response?.data?.message ?? "Error! couldn't load wallet info"
        );
        setPageLoading(false);
      });
  };

  const loadToWallet = () => {
    if (!rechargeAmount) {
      return;
    }

    setRechargeLoading(true);
    create("wallet/load", {
      // userId,
      amount: rechargeAmount,
      email: "test@gmail.com", //TODO: change email
    })
      .then((res) => {
        console.log(res);
        setPaymentPageContent(res);
        toast.success(res.message ?? "Balance updated successfully");
        setRechargeLoading(false);
      })
      .catch((e) => {
        console.error(e);
        toast.error(
          e?.response?.data?.message ?? "Error! couldn't update balance"
        );
        setRechargeLoading(false);
      });
  };

  const navigateToUserProfile = () => {
    navigate("/profile/" + walletInfo?.user?.username);
  };

  if (pageLoading) {
    return <PageLoading />;
  }

  if (paymentPageContent) {
    return (
      <div>
        <head>
          <title>Show Payment Page</title>
        </head>
        <div>
          <center>
            <h1>Please do not refresh this page...</h1>
          </center>
          <form
            method="post"
            action={`https://securegw-stage.paytm.in/theia/api/v1/showPaymentPage?mid=${paymentPageContent.mid}&orderId=${paymentPageContent.orderId}`}
            name="paytm"
          >
            <table>
              <input type="hidden" name="mid" value={paymentPageContent.mid} />
              <input
                type="hidden"
                name="orderId"
                value={paymentPageContent.orderId}
              />
              <input
                type="hidden"
                name="txnToken"
                value={paymentPageContent.txnToken}
              />
            </table>
            <script type="text/javascript"> document.paytm.submit(); </script>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <WalletHeader />

      <div className="page-content bg-gradient-2 min-vh-100">
        <div className="container profile-area">
          <div className="edit-profile">
            <div className="profile-image">
              <div className="media media-100 rounded-circle position-relative">
                <img
                  src={formatResourceURL(walletInfo?.user?.profile_img)}
                  onError={handleProfileImageError}
                  onClick={navigateToUserProfile}
                  style={{ cursor: "pointer" }}
                />
              </div>
              <div className="d-flex flex-column align-items-center">
                <span
                  className="fw-bold"
                  onClick={navigateToUserProfile}
                  style={{ cursor: "pointer" }}
                >
                  {getName(
                    walletInfo?.user ?? {
                      first_name: "trest",
                      last_name: "asd",
                    }
                  )}
                </span>
                <span
                  className=""
                  onClick={navigateToUserProfile}
                  style={{ cursor: "pointer" }}
                >
                  @{walletInfo?.username ?? "asdasd"}
                </span>
              </div>
            </div>

            <div className="text-center">
              <h3 className="m-3 align-center">Wallet Balance</h3>
              <h4 className="text-secondary">
                <i className="fa fa-inr me-1"></i>
                <span>100</span>
              </h4>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (rechargeAmount && !rechargeLoading) {
                  loadToWallet();
                }
              }}
              className="d-flex align-items-center flex-column"
            >
              <div className="mb-3 px-1">
                <label className="w-100 mb-2" htmlFor="amount">
                  Amount:
                </label>
                <input
                  id="amount"
                  type="number"
                  className="form-control numberInput"
                  placeholder=""
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(parseInt(e.target.value))}
                  min={0}
                />
              </div>
              <div>
                <button
                  disabled={!rechargeAmount || rechargeLoading}
                  className="btn btn-secondary"
                  type="submit"
                >
                  {rechargeLoading ? (
                    <i className="fa fa-spinner fa-spin"></i>
                  ) : (
                    <span>Load to Wallet</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
