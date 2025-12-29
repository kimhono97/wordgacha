
function WordChoiceViewer(pRootNode, pOptions) {
    // Settings
    this.m_nWno = (Math.random() * 1000) | 0;
    this.m_strYear = "";
    this.m_nOptIdx = 0;
    this.m_nScale = 1;
    this.m_pWInfo = null;
    this.m_pOptions = pOptions;
    this.m_pImgMap = new Object();
    this.m_strBgColor = "#5F9EA0";

    // DOM Elements
    this.m_pRootNode = pRootNode;
    this.m_pCtrlNode = null;
    this.m_pContentNode = null;
    this.m_pCanvas = null;
    this.m_pBtnSave = null;
    this.m_pColorPicker = null;
    this.m_pLogger = null;

    // Others
    this.m_pFuncResize = null;
    this.m_nResizeTimeout = -1;
    this.m_nRenderTimeout = -1;
    this.m_bOnRender = false;
}

WordChoiceViewer.CANVAS_MAXWIDTH = 4000;
WordChoiceViewer.CANVAS_MAXHEIGHT = 4000;

WordChoiceViewer.s_GetURLParam = function (sname) {
    if (typeof sname != "string") {
        sname = "";
    }
    let strParam = location.search.slice(location.search.indexOf("?") + 1);
    let params = strParam.split("&");
    if (params[0] && params[0].startsWith("h=")) {
        strParam = atob(decodeURIComponent(params[0].slice(2)));
        params = strParam.split("&");
    }
    for (let i = 0; i < params.length; i++) {
        temp = params[i].split("=");
        if (temp[0] == sname) {
            return temp[1];
        }
    }
    return "";
}
WordChoiceViewer.s_BindFunc = function (pThis, pFunc) {
    if (typeof pFunc != "function") {
        return null;
    }
    return function() {
        pFunc.apply(pThis, arguments);
    };
};
WordChoiceViewer.s_SplitText = function (strText, pCtx, nMaxWidth) {
    let pTexts = new Array();
    let pWords = strText.split(" ");
    while (true) {
        let i = 0;
        for (; i < pWords.length; i++) {
            let strLineText = pWords.slice(0, i + 1).join(" ");
            let pTextMetrics = pCtx.measureText(strLineText);
            if (pTextMetrics.width > nMaxWidth) {
                pTexts.push(pWords.slice(0, i).join(" "));
                pWords = pWords.slice(i);
                break;
            }
        }
        if (i == pWords.length) {
            pTexts.push(pWords.join(" "));
            break;
        }
    }
    return pTexts;
};

WordChoiceViewer.s_bookNamesOld = ['창세기', '출애굽기', '레위기', '민수기', '신명기', '여호수아', '사사기', '룻기', '사무엘상', '사무엘하', '열왕기상', '열왕기하', '역대상', '역대하', '에스라', '느헤미야', '에스더', '욥기', '시편', '잠언', '전도서', '아가', '이사야', '예레미야', '예레미야 애가', '에스겔', '다니엘', '호세아', '요엘', '아모스', '오바댜', '요나', '미가', '나훔', '하박국', '스바냐', '학개', '스가랴', '말라기'];
WordChoiceViewer.s_bookNamesNew = ['마태복음', '마가복음', '누가복음', '요한복음', '사도행전', '로마서', '고린도전서', '고린도후서', '갈라디아서', '에베소서', '빌립보서', '골로새서', '데살로니가전서', '데살로니가후서', '디모데전서', '디모데후서', '디도서', '빌레몬서', '히브리서', '야고보서', '베드로전서', '베드로후서', '요한1서', '요한2서', '요한3서', '유다서', '요한계시록'];
WordChoiceViewer.s_GetBookName = function (book=1) {
    if (book - 1 < this.s_bookNamesOld.length) {
        return this.s_bookNamesOld[book - 1];
    }
    return this.s_bookNamesNew[book - 1 - this.s_bookNamesOld.length];
};

WordChoiceViewer.prototype = {
    // Public
    Start: function() {
        this.parseParams();
        this.initLayout();
        this.loadWordInfo()
            .then(WordChoiceViewer.s_BindFunc(this, function (resJson) {
                this.m_pWInfo = resJson;
                this.render();
            }))
            .catch(WordChoiceViewer.s_BindFunc(this, function (reason) {
                alert("<!> Failed load the word information...\n\n" + reason);
                this.Dispose();  
            }));
    },
    Dispose: function() {
        this.m_pWInfo = null;
        this.m_pOptions = null;
        this.m_pImgMap = null;

        this.m_pCanvas = null;
        this.m_pCtrlNode = null;
        this.m_pContentNode = null;
        if (this.m_pRootNode) {
            this.m_pRootNode.innerHTML = "";
        }
        this.m_pRootNode = null;
    },

    // Private
    log: function (strText) {
        if (!this.m_pLogger) {
            console.log("[WordChoiceViewer]", strText);
            return;
        }
        this.m_pLogger.value += ("\n" + strText);
        if (this.m_pLogger.scrollHeight > this.m_pLogger.clientHeight) {
            this.m_pLogger.scrollTop = this.m_pLogger.scrollHeight;
        }
    },
    parseParams: function() {
        let nWno = parseInt(WordChoiceViewer.s_GetURLParam("wno"));
        if (!isNaN(nWno)) {
            this.m_nWno = nWno;
        }

        let strYear = WordChoiceViewer.s_GetURLParam("y");
        if (strYear) {
            this.m_strYear = strYear;
        }

        let strTarget = WordChoiceViewer.s_GetURLParam("t");
        if (strTarget) {
            this.m_strTarget = strTarget;
        }
    },
    initLayout: function() {
        if (!this.m_pRootNode) {
            throw new Error("No RootNode");
        }
        let pRootNode = this.m_pRootNode;
        pRootNode.classList.add("wc-layout-root");

        // Ctrl
        let pCtrlNode = document.createElement("div");
        pCtrlNode.classList.add("wc-layout-ctrl");
        pRootNode.appendChild(pCtrlNode);
        this.m_pCtrlNode = pCtrlNode;

        let pSelNode = document.createElement("select");
        this.m_pOptions.forEach(WordChoiceViewer.s_BindFunc(this, function (pOptObj, idx) {
            if (pOptObj.year && pOptObj.year.toString() != this.m_strYear) {
                return;
            }
            if (pOptObj.target && pOptObj.target.toString() != this.m_strTarget) {
                return;
            }
            let pOpt = document.createElement("option");
            pOpt.value = idx;
            pOpt.innerText = pOptObj.txt;
            let strKey = pOptObj.imgname;
            if (!this.m_pImgMap[strKey]) {
                let pImg = document.createElement("img");
                pImg.src = `./img/${pOptObj.imgname}`;
                this.m_pImgMap[strKey] = pImg;
            }
            pSelNode.appendChild(pOpt);
        }));
        pSelNode.selectedIndex = 0;
        this.m_nOptIdx = parseInt(pSelNode.options[0].value);
        pSelNode.addEventListener("change", WordChoiceViewer.s_BindFunc(this, function (event) {
            this.m_nOptIdx = parseInt(pSelNode.selectedOptions[0].value);
            this.render();
        }));
        this.m_pCtrlNode.appendChild(pSelNode);

        let pColorPicker = document.createElement("input");
        pColorPicker.type = "color";
        pColorPicker.value = this.m_strBgColor;
        pColorPicker.addEventListener("change", WordChoiceViewer.s_BindFunc(this, function (event) {
            this.m_strBgColor = pColorPicker.value;
            this.render();
        }))
        pColorPicker.style.display = "none";
        this.m_pCtrlNode.appendChild(pColorPicker);
        this.m_pColorPicker = pColorPicker;

        let pBtnSave = document.createElement("button");
        pBtnSave.innerText = "Save as PNG";
        pBtnSave.addEventListener("click", WordChoiceViewer.s_BindFunc(this, function (event) {
            if (!this.m_pCanvas) {
                return;
            }
            const strImgB64 = this.m_pCanvas.toDataURL("image/png");
            const pOptObj = this.m_pOptions[this.m_nOptIdx];
            const strFileName = `${this.m_strTarget || "test"}_wordchoice_${this.m_strYear}_${pOptObj.txt}.png`.replace(/ /g, "+");
            const a = document.createElement("a");
            a.setAttribute("href", strImgB64);
            a.setAttribute('download', strFileName);
            a.setAttribute('title', strFileName);
            a.setAttribute('target', '_blank');
            a.setAttribute('type', 'image/png');
            a.click();
        }));
        pBtnSave.setAttribute("targer", "_blank");
        pBtnSave.setAttribute("type", "image/png");
        pBtnSave.style.display = "none";
        this.m_pCtrlNode.appendChild(pBtnSave);
        this.m_pBtnSave = pBtnSave;
        
        // Cont
        let pContentNode = document.createElement("div");
        pContentNode.classList.add("wc-layout-cont")
        pRootNode.appendChild(pContentNode);
        this.m_pContentNode = pContentNode;

        let pCanvas = document.createElement("canvas");
        pCanvas.width = 1;
        pCanvas.height = 1;
        pCanvas.classList.add("wc-comp-canvas");
        pContentNode.appendChild(pCanvas);
        this.m_pCanvas = pCanvas;

        // Logger
        let pLogger = document.createElement("textarea");
        pLogger.classList.add("wc-comp-logger");
        pLogger.style.opacity = 0;
        pLogger.addEventListener("click", function (event) {
            if (pLogger.style.opacity == 0) {
                pLogger.style.opacity = 0.5;
            } else {
                pLogger.style.opacity = 0;
            }
        });
        pLogger.readOnly = true;
        pRootNode.appendChild(pLogger);
        this.m_pLogger = pLogger;
    },
    loadWordInfo: function() {
        const wno = this.m_nWno;
        return new Promise(function (resolve, reject) {
            fetch(`./data.json`)
                .then(function (res) {
                    return res.json();
                })
                .then(function (resJson) {
                    resolve(resJson[wno % resJson.length]);
                })
                .catch(function (reason) {
                    reject(reason);
                });
        });
    },
    resize: function() {
        if (!this.m_pContentNode || !this.m_pCanvas) {
            this.m_nResizeTimeout = -1;
            return;
        }

        this.m_pCanvas.style.display = "none";

        let pViewSize = new DOMRect();
        pViewSize.width = this.m_pContentNode.clientWidth - 10;
        pViewSize.height = this.m_pContentNode.clientHeight - 10;

        let nRatio = this.m_pCanvas.width / this.m_pCanvas.height;
        let nFrameRatio = this.m_pContentNode.clientWidth / this.m_pContentNode.clientHeight;
        if (nRatio > nFrameRatio) {
            pViewSize.height = pViewSize.width / nRatio;
        } else {
            pViewSize.width = pViewSize.height * nRatio;
        }

        this.m_pCanvas.style.width = pViewSize.width + "px";
        this.m_pCanvas.style.height = pViewSize.height + "px";

        this.m_pCanvas.style.display = "";
        this.m_nResizeTimeout = -1;
    },
    render: function () {
        if (this.m_bOnRender || !this.m_pContentNode || !this.m_pCanvas) {
            return;
        }
        if (this.m_nRenderTimeout != -1) {
            clearTimeout(this.m_nRenderTimeout);
            this.m_nRenderTimeout = -1;
        }

        let pOptObj = this.m_pOptions[this.m_nOptIdx];
        let pImg = this.m_pImgMap[pOptObj.imgname];
        if (!pImg.complete) {
            this.m_nRenderTimeout = setTimeout(WordChoiceViewer.s_BindFunc(this, function () {
                this.render();
            }), 100);
            return;
        }
        this.m_bOnRender = true;

        if (this.m_pFuncResize) {
            window.removeEventListener("resize", this.m_pFuncResize);
            this.m_pFuncResize = null;
        }
        this.m_pBtnSave.style.display = "none";
        this.m_pColorPicker.style.display = (pOptObj.txt.indexOf("Simple") == 0) ? "" : "none";

        let nImgRatio = pImg.width / pImg.height;
        let pImgSize = new DOMRect();
        if (pOptObj.styles.img) {
            pImgSize.x = pOptObj.styles.img.x;
            pImgSize.y = pOptObj.styles.img.y;
        }
        pImgSize.width = pImg.width;
        pImgSize.height = pImg.height;

        let pSize = new DOMRect();
        if (pOptObj.styles.size) {
            pSize.width = pOptObj.styles.size.width;
            pSize.height = pOptObj.styles.size.height;
        } else {
            pSize.width = pImgSize.width;
            pSize.height = pImgSize.height;
        }
        let nRatio = pSize.width / pSize.height;
        let nScale = pOptObj.styles.scale || 1;

        if (nRatio > 1) {
            if (nScale * pSize.width > WordChoiceViewer.CANVAS_MAXWIDTH) {
                nScale = WordChoiceViewer.CANVAS_MAXWIDTH / pSize.width;
                pSize.width = WordChoiceViewer.CANVAS_MAXWIDTH;
                pSize.height = pSize.width / nRatio;
            }
            if (nScale * (pImgSize.width + pImgSize.x) > WordChoiceViewer.CANVAS_MAXWIDTH) {
                nScale = (WordChoiceViewer.CANVAS_MAXWIDTH - pImgSize.x) / pImgSize.width;
                pImgSize.width = WordChoiceViewer.CANVAS_MAXWIDTH - pImgSize.x;
                pImgSize.height = pImgSize.width / nImgRatio;
            }
        } else {
            if (nScale * pSize.height > WordChoiceViewer.CANVAS_MAXHEIGHT) {
                nScale = WordChoiceViewer.CANVAS_MAXHEIGHT / pSize.height;
                pSize.height = WordChoiceViewer.CANVAS_MAXHEIGHT;
                pSize.width = pSize.height * nRatio;
            }
            if (nScale * (pImgSize.height + pImgSize.y) > WordChoiceViewer.CANVAS_MAXHEIGHT) {
                nScale = (WordChoiceViewer.CANVAS_MAXHEIGHT - pImgSize.y) / pImgSize.height;
                pImgSize.height = WordChoiceViewer.CANVAS_MAXHEIGHT - pImgSize.y;
                pImgSize.width = pImgSize.height * nImgRatio;
            }
        }
        pSize.width *= nScale;
        pSize.height *= nScale;
        pImgSize.x *= nScale;
        pImgSize.y *= nScale;
        pImgSize.width *= nScale;
        pImgSize.height *= nScale;

        let pViewSize = new DOMRect();
        pViewSize.width = this.m_pContentNode.clientWidth - 10;
        pViewSize.height = this.m_pContentNode.clientHeight - 10;
        let nFrameRatio = this.m_pContentNode.clientWidth / this.m_pContentNode.clientHeight;
        if (nRatio > nFrameRatio) {
            pViewSize.height = pViewSize.width / nRatio;
        } else {
            pViewSize.width = pViewSize.height * nRatio;
        }

        this.m_pCanvas.style.width = pViewSize.width + "px";
        this.m_pCanvas.style.height = pViewSize.height + "px";
        this.m_pCanvas.width = Math.floor(pSize.width);
        this.m_pCanvas.height = Math.floor(pSize.height);

        let pCtx = this.m_pCanvas.getContext("2d");
        pCtx.clearRect(0, 0, this.m_pCanvas.width, this.m_pCanvas.height);
        pCtx.fillStyle = this.m_strBgColor;
        pCtx.fillRect(0, 0, this.m_pCanvas.width, this.m_pCanvas.height);
        pCtx.drawImage(pImg, pImgSize.x, pImgSize.y, pImgSize.width, pImgSize.height);

        this.drawInfo(pCtx, pSize, nScale, pOptObj.styles);

        let pAreaSize = new DOMRect();
        let pContStyle = pOptObj.styles.content;
        if (pContStyle) {
            pAreaSize.x = pContStyle.x * nScale;
            pAreaSize.y = pContStyle.y * nScale;
            pAreaSize.width = pContStyle.width * nScale;
            pAreaSize.height = pContStyle.height * nScale;
        } else {
            pAreaSize.width = pSize.width;
            pAreaSize.height = pSize.height;
        }

        this.drawContent(pCtx, pAreaSize, pContStyle);

        this.m_pBtnSave.style.display = "";
        this.m_pFuncResize = WordChoiceViewer.s_BindFunc(this, function (event) {
            if (this.m_nResizeTimeout != -1) {
                clearTimeout(this.m_nResizeTimeout);
                this.m_nResizeTimeout = -1;
            }
            this.m_nResizeTimeout = setTimeout(WordChoiceViewer.s_BindFunc(this, this.resize), 100);
        });
        window.addEventListener("resize", this.m_pFuncResize);

        this.m_bOnRender = false;
        this.m_nRenderTimeout = setTimeout(WordChoiceViewer.s_BindFunc(this, this.render), 3000);
    },
    drawContent: function (pCtx, pAreaSize, pContStyle) {
        // pCtx.fillStyle = "rgba(255, 0, 0, 0.1)";
        // pCtx.fillRect(pAreaSize.x, pAreaSize.y, pAreaSize.width, pAreaSize.height);

        let nFontSize = Math.floor(Math.min(pAreaSize.width, pAreaSize.height) / 14);
        let strFontFamily = "PretendardMedium";
        let nLineHeight = Math.ceil(nFontSize * 1.8);
        let strFontColor = "rgba(0, 0, 0, 0.8)";
        // let strText = this.m_pWInfo.verse;
        let strText = this.m_pWInfo.contents.join(" ");
        let pTexts = new Array();
        if (pContStyle) {
            if (pContStyle.fontSize) {
                nFontSize = pContStyle.fontSize;
            }
            if (pContStyle.lineHeight) {
                nLineHeight = pContStyle.lineHeight;
            }
            if (pContStyle.fontFamily) {
                strFontFamily = pContStyle.fontFamily;
            }
            if (pContStyle.fontColor) {
                strFontColor = pContStyle.fontColor;
            }
        }

        pCtx.textAlign = "center";
        pCtx.textBaseline = "top";
        pCtx.fillStyle = strFontColor;
        pCtx.font = `bold ${nFontSize}px ${strFontFamily}`;

        let pTextMetrics = pCtx.measureText(strText);
        let nMaxWidth = pAreaSize.width * 0.95;
        if (pTextMetrics.width < nMaxWidth) {
            pTexts.push(strText);
        } else {
            pTexts = WordChoiceViewer.s_SplitText(strText, pCtx, nMaxWidth);
        }

        let strBookName = WordChoiceViewer.s_GetBookName(this.m_pWInfo.book);
        // let strBookName = this.m_pWInfo.bookname;
        pTexts.push(" ");
        if (this.m_pWInfo.end) {
            pTexts.push(`${strBookName} ${this.m_pWInfo.chapter}:${this.m_pWInfo.start}-${this.m_pWInfo.end}`);
        } else {
            pTexts.push(`${strBookName} ${this.m_pWInfo.chapter}:${this.m_pWInfo.start}`);
        }

        let nRemainingHeight = (pAreaSize.height - nLineHeight * pTexts.length);
        let nX = pAreaSize.x + pAreaSize.width / 2;
        let nY = pAreaSize.y + nRemainingHeight / 2 + nLineHeight / 2;
        this.log("<--- drawContent");
        pTexts.forEach(WordChoiceViewer.s_BindFunc(this, function (strLineText, i) {
            this.log([
                `${(new Date()).getTime()}`, `x=${nX}`, `y=${nY}`,
                `"${strLineText.length > 10 ? strLineText.slice(0, 10) + "..." : strLineText}"`
            ].join("\t"));
            
            pCtx.fillText(strLineText, Math.round(nX), Math.round(nY));
            nY += nLineHeight;
        }));
        this.log("---> drawContent");
    },
    drawInfo: function (pCtx, pSize, nScale, pStyles) {
        if (!pStyles) {
            return;
        }
        let nX = pSize.width / 2;
        let nY = 0;
        let nFontSize = Math.floor(Math.min(pSize.width, pSize.height) / 18);
        let strFontFamily = "Noto Sans KR";
        let strFontColor = "rgba(255, 255, 255, 1)";
        
        if (pStyles.year && pStyles.year.y) {
            nY = pStyles.year.y * nScale;
            if (pStyles.year.x) {
                nX = pStyles.year.x * nScale;
            }
            if (pStyles.year.fontSize) {
                nFontSize = pStyles.year.fontSize;
            }
            if (pStyles.year.fontColor) {
                strFontColor = pStyles.year.fontColor;
            }
            
            pCtx.textAlign = "center";
            pCtx.textBaseline = "top";
            pCtx.fillStyle = strFontColor;
            pCtx.font = `bold ${nFontSize}px ${strFontFamily}`;
            pCtx.fillText(this.m_strYear, nX, nY);
        }
        
        if (pStyles.labels) {
            pStyles.labels.forEach(function (pLabel, i) {
                if (!pLabel.text || !pLabel.y) {
                    return;
                }
                nX = pSize.width / 2;
                nY = pLabel.y * nScale;
                nFontSize = Math.floor(Math.min(pSize.width, pSize.height) / 30);
                strFontFamily = "Noto Sans KR";
                strFontColor = "rgba(255, 255, 255, 1)";
                if (pLabel.x) {
                    nX = pLabel.x * nScale;
                }
                if (pLabel.fontColor) {
                    strFontColor = pLabel.fontColor;
                }

                pCtx.textAlign = "center";
                pCtx.textBaseline = "top";
                pCtx.fillStyle = strFontColor;
                pCtx.font = `${nFontSize}px ${strFontFamily}`;
                pCtx.fillText(pLabel.text, nX, nY);
            });
        }
    },
};
