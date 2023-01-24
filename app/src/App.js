import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { decycle, retrocycle } from "json-cycle";
import { deploy } from "./deploy";
//import Escrow from "./Escrow";
import EscrowNew from "./Escrow_new";
import { connectToContract } from "./deploy";

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

export function checkArbiter(signer2) {
  if (document.getElementById("arbiterSaved") === null) {
    return "Guest ";
  } else {
    let arbiterAddressTemp = document.getElementById("arbiterSaved").innerHTML;
    let arbiterAddress = arbiterAddressTemp.trim();
    if (signer2 === arbiterAddress) {
      return "Arbiter";
    } else {
      return "Depositor";
    }
  }
}

async function handleApproveTwo(address, signer) {
  let instance = await connectToContract(address, signer);
  const approveTxn2 = await instance.connect(signer).isApproved();
  if (approveTxn2) {
    document.getElementById(instance.address).className = "complete";
    document.getElementById(instance.address).innerText =
      "✓ It's already been approved!";
  } else {
    const approveTxn = await instance.connect(signer).approve();
    await approveTxn.wait();
    document.getElementById(instance.address).className = "complete";
    document.getElementById(instance.address).innerText =
      "✓ It's been approved!";
  }
}

let callBackendAPI = async (mydict) => {
  const response = await fetch("/express_backend", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ a: decycle(mydict) }),
  });
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message);
  }
  return body;
};

function App() {
  const [mydata, setMydata] = useState([]);
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();
  const [signer2, setSigner2] = useState(
    "0x0000000000000000000000000000000000000000"
  );

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      const signer = provider.getSigner();
      setSigner(signer);
      const addr2 = await signer.getAddress();
      setSigner2(addr2.toString());
      window.ethereum.on("accountsChanged", async function () {
        const addr = await signer.getAddress();
        setSigner2(addr.toString());
      });
    }

    getAccounts();
  }, [account]);

  useEffect(() => {
    callBackendAPI(escrows)
      .then((res) => {
        if (res.express.length === 0 || res.express === undefined) {
          setMydata([]);
        } else {
          setMydata(retrocycle(res.express));
        }
      })
      .catch((err) => console.log(err));
  }, [escrows]);

  async function newContract() {
    const beneficiary = document.getElementById("beneficiary").value;
    const arbiter = document.getElementById("arbiter").value;
    const value = ethers.BigNumber.from(document.getElementById("wei").value);
    //const valEth = ethers.BigNumber.from(document.getElementById("wei").value);
    //const decimals = ethers.BigNumber.from("1000000000000000000");
    //const value = valEth.mul(decimals);
    const escrowContract = await deploy(signer, arbiter, beneficiary, value);

    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: value.toString(),
      handleApprove: async () => {
        escrowContract.on("Approved", () => {
          document.getElementById(escrowContract.address).className =
            "complete";
          document.getElementById(escrowContract.address).innerText =
            "✓ It's been approved!";
        });

        await approve(escrowContract, signer);
      },
    };
    setEscrows([...escrows, escrow]);
  }

  return (
    <>
      <div className="contract">
        Your Current Address: {signer2}
        <br />
        Status: {checkArbiter(signer2)}
      </div>

      <br />
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input type="text" id="arbiter" />
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" />
        </label>

        <label>
          Deposit Amount (in Eth)
          <input type="text" id="wei" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();
            newContract();
          }}
        >
          Deploy
        </div>
      </div>
      <div className="existing-contracts">
        <div>
          {mydata.length > 0 ? (
            mydata.map((escrow) => {
              return <EscrowNew key={escrow.address} {...escrow} />;
            })
          ) : (
            <h1> No Contract For Approval </h1>
          )}
        </div>
        <div
          className="button"
          id={mydata.length > 0 ? mydata[0].address : "555"}
          onClick={(e) => {
            e.preventDefault();
            mydata.length > 0
              ? handleApproveTwo(mydata[0].address, signer)
              : console.log("");
          }}
        >
          Approve
        </div>
      </div>
    </>
  );
}

export default App;
