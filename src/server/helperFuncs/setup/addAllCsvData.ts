import SPY_SYMBOLS from "../../common/consts/stock_symbols";
import fs from "fs";
import { parse } from "fast-csv";
import isNullOrUndefined from "../../common/utils/isNullOrUndefined";
const dataPath =
  "C:\\Users\\DLF\\Documents\\newCode\\t3\\delfun\\src\\server\\data";
const fullCsvDataPath = dataPath + "\\stockFullData";
async function readFullCsv(symbol: string) {
  const stvList: any[] = [];
  fs.createReadStream(fullCsvDataPath + `\\${symbol}.csv`)
    .pipe(parse({ headers: true }))
    .on("error", (error) => console.error(error))
    .on("data", (row) => {
      try {
        const priceStr: string = row["Close"];
        const stockPrice = Math.round(parseFloat(priceStr) * 100) / 100;
        if (Number.isNaN(stockPrice)) {
          //throw Error("stockPrice Failed");
          return;
        }
        let dateStr: string = row["Date"];
        dateStr = dateStr.slice(0, 10);
        stvList.push({
          timestamp: new Date(dateStr),
          price: Math.round(parseFloat(priceStr) * 100) / 100,
          stock_symbol: symbol,
        });
      } catch (error) {
        console.log("Error Occurred: ", error, symbol);
      }
    })

    .on("end", async () => {
      await prisma?.stockTimeVal.createMany({ data: stvList });
    });
}
export async function getCsvData() {
  const sVals = await prisma?.stockTimeVal.findFirst();
  if (!isNullOrUndefined(sVals)) {
    return;
  }
  SPY_SYMBOLS.forEach(async (element) => {
    await readFullCsv(element);
    //await new Promise((resolve) => setTimeout(resolve, 2000));
  });
}
