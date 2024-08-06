import { Drizzle, generateStore } from "drizzle";
import Landemic from "./contracts/Landemic.json";
import BulkProxy from "./contracts/BulkProxy.json";

export default function createStore() {
  try {
    const options = {
      contracts: [Landemic, BulkProxy],
      events: {
          Landemic: ['Transfer'],
      },
      web3: { fallback: { url: process.env.REACT_APP_DRIZZLE_FALLBACK_URL } }
    };

    const drizzleStore = generateStore(options)
    const drizzle = new Drizzle(options, drizzleStore)

    return drizzle;
  } catch (e) {
    console.log(e);
  }
}
