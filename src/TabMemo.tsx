import { useState, useLayoutEffect } from "react";
import { v4 as uuidv4 } from "uuid";

type TabType = {
  id: string;
  title: string;
  url: string;
  faviconUrl: string | undefined;
};

const TabMemo = () => {
  const KEY_OF_SESSION_STORAGE = "tabMemo";

  const [tabsState, setTabsState] = useState<TabType[]>([]);
  const [memosObjState, setMemosObjState] = useState<Record<string, string>>(
    {}
  );

  const setMemo = (url: string, memo: string) => {
    setMemosObjState((prevState) => ({ ...prevState, [url]: memo }));
  };

  const getMemo = (url: string) =>
    memosObjState[url] !== undefined ? memosObjState[url] : "";

  const setTabsToStorage = () => {
    const memosObjJson = JSON.stringify(memosObjState);
    chrome.storage.local.set(
      { [KEY_OF_SESSION_STORAGE]: memosObjJson },
      () => {}
    );
  };

  const setTabs = async () => {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    const tabList: TabType[] = [];

    chrome.storage.local.get([KEY_OF_SESSION_STORAGE], (result) => {
      let memosObjJson = "{}";
      if (result[KEY_OF_SESSION_STORAGE] !== undefined) {
        memosObjJson = result[KEY_OF_SESSION_STORAGE];
      }

      const parseMemosObj = JSON.parse(memosObjJson);
      const memosObj: Record<string, string> = {};

      tabs.forEach((tab) => {
        if (tab.title !== undefined && tab.url !== undefined) {
          const memo =
            parseMemosObj[tab.url] !== undefined ? parseMemosObj[tab.url] : "";

          tabList.push({
            id: uuidv4(),
            title: tab.title,
            url: tab.url,
            faviconUrl: tab.favIconUrl,
          });

          memosObj[tab.url] = memo;
        }
      });

      setTabsState([...tabList]);
      setMemosObjState({ ...memosObj });
    });
  };

  useLayoutEffect(() => {
    setTabs();
  }, []);

  return (
    <div id="tab-memo" style={{ width: 500, fontSize: "1rem" }}>
      <div>
        {tabsState.map((tab) => (
          <div
            key={tab.id}
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 5,
              marginBottom: 5,
            }}
          >
            <img
              src={tab.faviconUrl}
              alt=""
              width={16}
              height={16}
              style={{ marginRight: 5 }}
            />
            <div
              style={{
                width: 200,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {tab.title}
            </div>
            <input
              type="text"
              style={{ width: "100%" }}
              value={getMemo(tab.url)}
              onChange={(e) => setMemo(tab.url, e.target.value)}
              onBlur={() => setTabsToStorage()}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabMemo;
