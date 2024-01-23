$(() => {
  const revisionid = mw.config.get("wgCurRevisionId");
  const section = new URLSearchParams(location.search).get("section");
  function debounce(func, wait) {
    let timeout;

    return function executedFunction() {
      const later = () => {
        clearTimeout(timeout);
        func();
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function saveText() {
    const text = $("#wpTextbox1").val();
    const info = {
      revisionid,
      section,
    };
    localStorage.setItem(
      `unsavedText ${mw.config.get("wgPageName")}`,
      JSON.stringify({ text, info })
    );
  }

  function getStoredText() {
    const storedText = localStorage.getItem(
      `unsavedText ${mw.config.get("wgPageName")}`,
      mw.config.get("wgPageName")
    );
    if (storedText) {
      const { text, info } = JSON.parse(storedText);
      if (
        info.revisionid === revisionid &&
        (info.section === section || (!info.section && !section))
      ) {
        if (confirm("קיים לדף זה טקסט שלא שמרת\nתרצה לשחזרו?"))
          localStorage.removeItem(
            `unsavedText ${mw.config.get("wgPageName")}`,
            mw.config.get("wgPageName")
          );
        $("#wpTextbox1").val(text);
      } else if (info.revisionid !== mw.config.get("wgCurRevisionId")) {
        if (
          confirm(
            "קיים לדף זה טקסט שלא שמרת, אולם הדף נערך מאז.\nתרצה לשחזר את הטקסט תוך הקפדה על שמירת העריכות החדשות?"
          )
        ) {
          localStorage.removeItem(
            `unsavedText ${mw.config.get("wgPageName")}`,
            mw.config.get("wgPageName")
          );
          $("#wpTextbox1").val(text);
        }
      }
    }
  }
  if (
    mw.config.get("wgAction") === "edit" ||
    mw.config.get("wgAction") === "submit"
  ) {
    getStoredText();
    $("#wpTextbox1").on("input", debounce(saveText, 5000));
  }
});
