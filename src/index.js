import "@logseq/libs";
import { logseq as PL } from "../package.json";
import { settingUI } from "./setting";
const pluginId = PL.id;

/* main */
const main = () => {
  settingUI(); /* -setting */
  console.info(`#${pluginId}: MAIN`); /* -plugin-id */
  logseq.UI.showMsg(
    `ブクログ用プラグインが読み込まれました。\n\nブクログのエクスポート画面と変換用サイトがブラウザに開かれています。\n\n\nブクログからファイルをダウンロードして、それを変換用サイトにアップロードしてください。\n\n発行されたURLをコピーして、設定画面で貼り付けてください。\n\n\nそのあとツールバーの📚ボタンを押すとインポートが実行されます。`,
    `info`,
    { timeout: 100000 }
  ); //start message
  logseq.showSettingsUI();
  logseq.App.openExternalLink('http://yu000jp.php.xdomain.jp/main/booklog/logseq/');
  logseq.App.openExternalLink('https://booklog.jp/export');
  /* CSS */
  /*logseq.provideStyle(String.raw`

  `);*/

  /* toolbarItem */
  logseq.App.registerUIItem("toolbar", {
    key: pluginId,
    template: `
    <div data-on-click="open_booklog_jp" style="font-size:20px">📚</div>
    `,
  }); /* For open_booklog_jp */

  console.info(`#${pluginId}: loaded`);
}; /* end_main */

/* dashboard */
const model = {
  async open_booklog_jp() {
    console.info(`#${pluginId}: open_booklog_jp`);

    /* JSON */
    const settingJsonUrl = logseq.settings.jsonUrl;
    if (settingJsonUrl != "") {
      const jsonImport = async (jsonUrl) => {
        const response = await fetch(jsonUrl);
        const jsonData = await response.json();
        console.log(`#${pluginId}: JSON import`);
        console.log(jsonData);
        console.log(`jsonData No.0: ` + jsonData[0]);

        //foreach JSON
        const foreachPage = await jsonData.forEach(function (item, index) {
          if (item.type === "") {
            item.type = "本";
          }
          const createPageTitle = item.type + "/" + item.title;
          item.title = createPageTitle;
            //create page
            const createP = logseq.Editor.createPage(createPageTitle, item, {
              createFirstBlock: true,
              format: "markdown",
              redirect: false,
            });
            console.log(`create: ` + createPageTitle);
            logseq.UI.showMsg(`create:` + createPageTitle);

        });
        //foreach JSON end

        console.log(`#${pluginId}: JSON import done`);
        logseq.showSettingsUI();
        logseq.UI.showMsg("success: 作成が終わりました。\n\n\n`reindex`をおこなってください。\n\n*終了したらプラグインをオフにしてください。\n\n\nそのあと左メニューにある [全ページ] を開いてみてください。", `success`, {
          timeout: 30000,
        }); //success message
      };
      jsonImport(settingJsonUrl);
    } else {
      console.log(`#${pluginId}: warning`);
      logseq.UI.showMsg(`プラグインの設定をおこなってください。`, `warning`, {
        timeout: 10000,
      }); //warning message
      logseq.showSettingsUI();
    }
    console.log(`#${pluginId}: open_booklog_jp end`);
  },
};

logseq.ready(model, main).catch(console.error);
