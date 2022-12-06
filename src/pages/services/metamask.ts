import { ethers } from "ethers";
import { Turing_Dapp_Contract_Address, Turing_Dapp_Contract_ABI } from "../config/keys";

export async function loginMetaMask(setTuringDappContract: any) {
  /* 1. Enable ethereum connection */
  /* 3. Prompt user to sign in to MetaMask */
  const provider = new ethers.providers.Web3Provider(window.ethereum, "goerli");
  console.log(provider)
  provider.send("eth_requestAccounts", []).then(() => {
    provider.listAccounts().then((accounts) => {
      const signer = provider.getSigner(accounts[0]);
      console.log(signer)

      /* 3.1 Criação da instância do contrato inteligente de Pet */
      const newTuringDappContract = new ethers.Contract(
        Turing_Dapp_Contract_Address, 
        Turing_Dapp_Contract_ABI, 
        signer
      )
      setTuringDappContract(newTuringDappContract)
      console.log(newTuringDappContract)
      console.log(newTuringDappContract.signer)
    });
  });
}


