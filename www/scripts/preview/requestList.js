require.def("preview/requestList",["domplate/domplate","core/lib","i18n!nls/requestList","preview/harModel","core/cookies","preview/requestBody","domplate/infoTip","domplate/popupMenu"],function(Domplate,Lib,Strings,HarModel,Cookies,RequestBody,InfoTip,Menu){with(Domplate){function RequestList(a){this.input=a,this.pageTimings=[],this.addPageTiming({name:"onContentLoad",classes:"netContentLoadBar",description:Strings.ContentLoad}),this.addPageTiming({name:"onLoad",classes:"netWindowLoadBar",description:Strings.WindowLoad}),InfoTip.addListener(this)}RequestList.columns=["url","status","type","domain","size","timeline"],RequestList.defaultColumns=["url","status","size","timeline"],RequestList.getVisibleColumns=function(){var a=Cookies.getCookie("previewCols");if(a){a=a.replace(/\+/g," "),a=unescape(a);return a.split(" ")}if(!a){var b=document.getElementById("content");if(b){a=b.getAttribute("previewCols");if(a)return a.split(" ")}}return Lib.cloneArray(RequestList.defaultColumns)},RequestList.setVisibleColumns=function(a,b){a||(a=RequestList.getVisibleColumns()),a.join&&(a=a.join(" "));var c=document.getElementById("content");c&&c.setAttribute("previewCols",a),b||Cookies.setCookie("previewCols",a)},RequestList.setVisibleColumns(),RequestList.prototype=domplate({tableTag:TABLE({"class":"netTable",cellpadding:0,cellspacing:0,onclick:"$onClick",_repObject:"$requestList"},TBODY(TR({"class":"netSizerRow"},TD({"class":"netHrefCol netCol",width:"20%"}),TD({"class":"netStatusCol netCol",width:"7%"}),TD({"class":"netTypeCol netCol",width:"7%"}),TD({"class":"netDomainCol netCol",width:"7%"}),TD({"class":"netSizeCol netCol",width:"7%"}),TD({"class":"netTimeCol netCol",width:"100%"}),TD({"class":"netOptionsCol netCol",width:"15px"})))),fileTag:FOR("file","$files",TR({"class":"netRow loaded",$isExpandable:"$file|isExpandable",$responseError:"$file|isError",$responseRedirect:"$file|isRedirect",$fromCache:"$file|isFromCache"},TD({"class":"netHrefCol netCol"},DIV({"class":"netHrefLabel netLabel",style:"margin-left: $file|getIndent\\px"},"$file|getHref"),DIV({"class":"netFullHrefLabel netHrefLabel netLabel",style:"margin-left: $file|getIndent\\px"},"$file|getFullHref")),TD({"class":"netStatusCol netCol"},DIV({"class":"netStatusLabel netLabel"},"$file|getStatus")),TD({"class":"netTypeCol netCol"},DIV({"class":"netTypeLabel netLabel"},"$file|getType")),TD({"class":"netDomainCol netCol"},DIV({"class":"netDomainLabel netLabel"},"$file|getDomain")),TD({"class":"netSizeCol netCol"},DIV({"class":"netSizeLabel netLabel"},"$file|getSize")),TD({"class":"netTimeCol netCol"},DIV({"class":"netTimelineBar"},"&nbsp;",DIV({"class":"netBlockingBar netBar"}),DIV({"class":"netResolvingBar netBar"}),DIV({"class":"netConnectingBar netBar"}),DIV({"class":"netSendingBar netBar"}),DIV({"class":"netWaitingBar netBar"}),DIV({"class":"netReceivingBar netBar"},SPAN({"class":"netTimeLabel"},"$file|getElapsedTime")))),TD({"class":"netOptionsCol netCol"},DIV({"class":"netOptionsLabel netLabel",onclick:"$onOpenOptions"})))),headTag:TR({"class":"netHeadRow"},TD({"class":"netHeadCol",colspan:7},DIV({"class":"netHeadLabel"},"$doc.rootFile.href"))),netInfoTag:TR({"class":"netInfoRow"},TD({"class":"netInfoCol",colspan:7})),summaryTag:TR({"class":"netRow netSummaryRow"},TD({"class":"netHrefCol netCol"},DIV({"class":"netCountLabel netSummaryLabel"},"-")),TD({"class":"netStatusCol netCol"}),TD({"class":"netTypeCol netCol"}),TD({"class":"netDomainCol netCol"}),TD({"class":"netTotalSizeCol netSizeCol netCol"},DIV({"class":"netTotalSizeLabel netSummaryLabel"},"0KB")),TD({"class":"netTotalTimeCol netTimeCol netCol"},DIV({"class":"",style:"width: 100%"},DIV({"class":"netCacheSizeLabel netSummaryLabel"},"(",SPAN("0KB"),SPAN(" "+Strings.fromCache),")"),DIV({"class":"netTimeBar"},SPAN({"class":"netTotalTimeLabel netSummaryLabel"},"0ms")))),TD({"class":"netOptionsCol netCol"})),getIndent:function(a){return 0},isError:function(a){var b=Math.floor(a.response.status/100);return b==4||b==5},isRedirect:function(a){return!1},isFromCache:function(a){return a.cache&&a.cache.afterRequest},getHref:function(a){var b=Lib.getFileName(this.getFullHref(a));return unescape(a.request.method+" "+b)},getFullHref:function(a){return unescape(a.request.url)},getStatus:function(a){var b=a.response.status>0?a.response.status+" ":"";return b+a.response.statusText},getType:function(a){return a.response.content.mimeType},getDomain:function(a){return Lib.getPrettyDomain(a.request.url)},getSize:function(a){var b=a.response.bodySize,c=b&&b!=-1?b:a.response.content.size;return this.formatSize(c)},isExpandable:function(a){var b=a.response.headers.length>0,c=a.request.url.indexOf("data:")==0;return b||c},formatSize:function(a){return Lib.formatSize(a)},getElapsedTime:function(a){var b=Math.round(a.time*10)/10;return Lib.formatTime(b)},onClick:function(a){var b=Lib.fixEvent(a);if(Lib.isLeftClick(a)){var c=Lib.getAncestorByClass(b.target,"netRow");c&&(this.toggleHeadersRow(c),Lib.cancelEvent(a))}else Lib.isControlClick(a)&&window.open(a.target.innerText||a.target.textContent)},toggleHeadersRow:function(a){if(Lib.hasClass(a,"isExpandable")){var b=a.repObject;Lib.toggleClass(a,"opened");if(Lib.hasClass(a,"opened")){var c=this.netInfoTag.insertRows({},a)[0];c.repObject=b;var d=new RequestBody;d.render(c.firstChild,b)}else{var c=a.nextSibling,e=Lib.getElementByClass(c,"netInfoBody");a.parentNode.removeChild(c)}}},onOpenOptions:function(a){var b=Lib.fixEvent(a);Lib.cancelEvent(a);if(Lib.isLeftClick(a)){var c=b.target,d=Lib.getAncestorByClass(c,"netRow"),e=this.getMenuItems(d);if(!e.length)return;var f=new Menu({id:"requestContextMenu",items:e});f.showPopup(c)}},getMenuItems:function(a){var b=a.repObject,c=a.phase,d=c.files[0]==b&&this.phases[0]==c,e=[{label:Strings.menuBreakTimeline,type:"checkbox",disabled:d,checked:c.files[0]==b&&!d,command:Lib.bind(this.breakLayout,this,a)},"-",{label:Strings.menuOpenRequest,command:Lib.bind(this.openRequest,this,b)},{label:Strings.menuOpenResponse,disabled:!b.response.content.text,command:Lib.bind(this.openResponse,this,b)}];Lib.dispatch(this.listeners,"getMenuItems",[e,this.input,b]);return e},openRequest:function(a,b){window.open(b.request.url)},openResponse:function(a,b){var c=b.response.content.text,d=b.response.content.mimeType,e=b.response.content.encoding,f="data:"+(d?d:"")+";"+(e?e:"")+","+c;window.open(f)},breakLayout:function(a,b){var c=b.repObject,d=b.phase,e=d.files[0]==c;b.breakLayout=!e,b.setAttribute("breakLayout",b.breakLayout?"true":"false");var f=Lib.getAncestorByClass(b,"netTable"),g=HarModel.getParentPage(this.input,c);this.updateLayout(f,g)},updateLayout:function(a,b){var c=HarModel.getPageEntries(this.input,b);this.table=a;var d=this.table.firstChild,e=this.firstRow=d.firstChild.nextSibling;this.phases=[];var f=Cookies.getCookie("phaseInterval");f||(f=4e3);var g=null,h=b?Lib.parseISO8601(b.startedDateTime):null,i=b&&b.pageTimings?b.pageTimings.onLoad:-1;i>0&&(i+=h);for(var j=0;j<c.length;j++){var k=c[j];Lib.hasClass(e,"netInfoRow")&&(e=e.nextSibling),e.repObject=k,h||(h=Lib.parseISO8601(k.startedDateTime));var l=Lib.parseISO8601(k.startedDateTime),m=g?Lib.parseISO8601(g.getLastStartTime()):0,n=g?g.endTime:0,o=!1;f>=0&&(o=l>i&&l-m>=f&&l+k.time>=n+f),typeof e.breakLayout=="boolean"?!g||e.breakLayout?g=this.startPhase(k):g.addFile(k):!g||o?g=this.startPhase(k):g.addFile(k),this.phases[0]!=g&&e.setAttribute("breakLayout",g.files[0]==k?"true":"false");if(g.startTime==undefined||g.startTime>l)g.startTime=l;if(g.endTime==undefined||g.endTime<l+k.time)g.endTime=l+k.time;e=e.nextSibling}this.updateTimeStamps(b),this.updateTimeline(b),this.updateSummaries(b)},startPhase:function(a){var b=new Phase(a);this.phases.push(b);return b},calculateFileTimes:function(a,b,c){c!=b.phase&&(c=b.phase,this.phaseStartTime=c.startTime,this.phaseEndTime=c.endTime,this.phaseElapsed=this.phaseEndTime-c.startTime);if(!b.timings)return c;var d=b.timings.blocked<0?0:b.timings.blocked,e=d+(b.timings.dns<0?0:b.timings.dns),f=e+(b.timings.connect<0?0:b.timings.connect),g=f+(b.timings.send<0?0:b.timings.send),h=g+(b.timings.wait<0?0:b.timings.wait),i=h+(b.timings.receive<0?0:b.timings.receive),j=b.time,k=Lib.parseISO8601(b.startedDateTime);this.barOffset=((k-this.phaseStartTime)/this.phaseElapsed*100).toFixed(3),this.barBlockingWidth=(d/this.phaseElapsed*100).toFixed(3),this.barResolvingWidth=(e/this.phaseElapsed*100).toFixed(3),this.barConnectingWidth=(f/this.phaseElapsed*100).toFixed(3),this.barSendingWidth=(g/this.phaseElapsed*100).toFixed(3),this.barWaitingWidth=(h/this.phaseElapsed*100).toFixed(3),this.barReceivingWidth=(i/this.phaseElapsed*100).toFixed(3),this.calculatePageTimings(a,b,c);return c},calculatePageTimings:function(a,b,c){if(a){var d=Lib.parseISO8601(a.startedDateTime);for(var e=0;e<c.pageTimings.length;e++){var f=c.pageTimings[e].time;if(f>0){var g=d+f-c.startTime,h=(g/this.phaseElapsed*100).toFixed(3);c.pageTimings[e].offset=h}}}},updateTimeline:function(a){var b=this.table.firstChild,c;for(var d=this.firstRow;d;d=d.nextSibling){var e=d.repObject;if(!e)continue;if(Lib.hasClass(d,"netInfoRow"))continue;c=this.calculateFileTimes(a,e,c),d.phase=e.phase,delete e.phase;var f=Lib.getElementByClass(d,"netTimelineBar"),g=f.children[0],h=g.nextSibling,i=h.nextSibling,j=i.nextSibling,k=j.nextSibling,l=k.nextSibling;g.style.left=i.style.left=h.style.left=j.style.left=k.style.left=l.style.left=this.barOffset+"%",g.style.width=this.barBlockingWidth+"%",h.style.width=this.barResolvingWidth+"%",i.style.width=this.barConnectingWidth+"%",j.style.width=this.barSendingWidth+"%",k.style.width=this.barWaitingWidth+"%",l.style.width=this.barReceivingWidth+"%";var m=Lib.getElementsByClass(f,"netPageTimingBar");for(var n=0;n<m.length;n++)m[n].parentNode.removeChild(m[n]);for(var n=0;n<c.pageTimings.length;n++){var o=c.pageTimings[n];if(!o.offset)continue;var p=f.ownerDocument.createElement("DIV");f.appendChild(p),o.classes&&Lib.setClass(p,o.classes),Lib.setClass(p,"netPageTimingBar netBar"),p.style.left=o.offset+"%",p.style.display="block",o.offset=null}}},updateTimeStamps:function(a){if(a){var b=[];for(var c=0;a.pageTimings&&c<this.pageTimings.length;c++){var d=this.pageTimings[c],e=a.pageTimings[d.name];e>0&&b.push({label:d.name,time:e,classes:d.classes,comment:d.description})}var f=a.pageTimings?a.pageTimings._timeStamps:[];f&&b.push.apply(b,f);var g=this.phases;for(var c=0;c<g.length;c++){var h=g[c],i=g[c+1];for(var j=0;j<b.length;j++){var k=b[j],l=k.time;if(!l)continue;var m=Lib.parseISO8601(a.startedDateTime);l+=m;if(!i||l<i.startTime)if(c==0||l>=h.startTime)h.startTime>l&&(h.startTime=l),h.endTime<l&&(h.endTime=l),h.pageTimings.push({classes:k.classes?k.classes:"netTimeStampBar",name:k.label,description:k.comment,time:k.time})}}}},updateSummaries:function(a){var b=this.phases,c=0,d=0,e=0,f=0;for(var g=0;g<b.length;++g){var h=b[g];h.invalidPhase=!1;var i=this.summarizePhase(h);c+=i.fileCount,d+=i.totalSize,e+=i.cachedSize,f+=i.totalTime}var j=this.summaryRow;if(j){var k=Lib.getElementByClass(j,"netCountLabel");k.firstChild.nodeValue=this.formatRequestCount(c);var l=Lib.getElementByClass(j,"netTotalSizeLabel");l.setAttribute("totalSize",d),l.firstChild.nodeValue=Lib.formatSize(d);var m=Lib.getElementByClass(j,"netCacheSizeLabel");m.setAttribute("collapsed",e==0),m.childNodes[1].firstChild.nodeValue=Lib.formatSize(e);var n=Lib.getElementByClass(j,"netTotalTimeLabel"),o=Lib.formatTime(f);a&&a.pageTimings.onLoad>0&&(o+=" (onload: "+Lib.formatTime(a.pageTimings.onLoad)+")"),n.innerHTML=o}},formatRequestCount:function(a){return a+" "+(a==1?Strings.request:Strings.requests)},summarizePhase:function(a){var b=0,c=0,d="all";d=="all"&&(d=null);var e=0,f=0,g=0;for(var h=0;h<a.files.length;h++){var i=a.files[h],j=Lib.parseISO8601(i.startedDateTime);if(!d||i.category==d){++e;var k=i.response.bodySize,l=k&&k!=-1?k:i.response.content.size;c+=l,i.response.status==304&&(b+=l);if(!f||j<f)f=j;var m=j+i.time;m>g&&(g=m)}}var n=g-f;return{cachedSize:b,totalSize:c,totalTime:n,fileCount:e}},showInfoTip:function(a,b,c,d){var e=Lib.getAncestorByClass(b,"netTable");if(e&&e.repObject==this){var f=Lib.getAncestorByClass(b,"netRow");if(f){if(Lib.getAncestorByClass(b,"netBar")){a.setAttribute("multiline",!0);var g=f.repObject.startedDateTime+"-nettime";this.infoTipURL=g;return this.populateTimeInfoTip(a,f)}if(Lib.hasClass(b,"netSizeLabel")){var g=f.repObject.startedDateTime+"-netsize";this.infoTipURL=g;return this.populateSizeInfoTip(a,f)}}}},populateTimeInfoTip:function(a,b){EntryTimeInfoTip.render(this,b,a);return!0},populateSizeInfoTip:function(a,b){EntrySizeInfoTip.render(this,b,a);return!0},render:function(a,b){var c=HarModel.getPageEntries(this.input,b);if(!c.length)return null;return this.append(a,b,c)},append:function(a,b,c){this.table||(this.table=this.tableTag.replace({requestList:this},a,this)),this.summaryRow||(this.summaryRow=this.summaryTag.insertRows({},this.table.firstChild)[0]);var d=this.table.firstChild,e=d.lastChild.previousSibling,f=this.fileTag.insertRows({files:c},e,this);this.updateLayout(this.table,b);return f[0]},addPageTiming:function(a){this.pageTimings.push(a)}});function Phase(a){this.files=[],this.pageTimings=[],this.addFile(a)}Phase.prototype={addFile:function(a){this.files.push(a),a.phase=this},getLastStartTime:function(){return this.files[this.files.length-1].startedDateTime}};var EntryTimeInfoTip=domplate({tableTag:TABLE({"class":"timeInfoTip"},TBODY()),timingsTag:FOR("time","$timings",TR({"class":"timeInfoTipRow",$collapsed:"$time|hideBar"},TD({"class":"$time|getBarClass timeInfoTipBar",$loaded:"$time.loaded",$fromCache:"$time.fromCache"}),TD({"class":"timeInfoTipCell startTime"},"$time.start|formatStartTime"),TD({"class":"timeInfoTipCell elapsedTime"},"$time.elapsed|formatTime"),TD("$time|getLabel"))),startTimeTag:TR(TD(),TD("$startTime.time|formatStartTime"),TD({"class":"timeInfoTipStartLabel",colspan:2},"$startTime|getLabel")),separatorTag:TR({},TD({"class":"timeInfoTipSeparator",colspan:4,height:"10px"},SPAN("$label"))),eventsTag:FOR("event","$events",TR({"class":"timeInfoTipEventRow"},TD({"class":"timeInfoTipBar",align:"center"},DIV({"class":"$event|getPageTimingClass timeInfoTipEventBar"})),TD("$event.start|formatStartTime"),TD({colspan:2},"$event|getTimingLabel"))),hideBar:function(a){return!a.elapsed&&a.bar=="request.phase.Blocking"},getBarClass:function(a){var b=a.bar.substr(a.bar.lastIndexOf(".")+1);return"net"+b+"Bar"},getPageTimingClass:function(a){return a.classes?a.classes:""},formatTime:function(a){return Lib.formatTime(a)},formatStartTime:function(a){var b=a>0,c=Lib.formatTime(Math.abs(a));if(!a)return c;return(b>0?"+":"-")+c},getLabel:function(a){return Strings[a.bar]},getTimingLabel:function(a){return a.bar},render:function(a,b,c){var d=a.input,e=b.repObject,f=HarModel.getParentPage(d,e),g=f?Lib.parseISO8601(f.startedDateTime):null,h=Lib.parseISO8601(e.startedDateTime),i=EntryTimeInfoTip.tableTag.replace({},c),j={};g?j.time=h-g:j.time=h-b.phase.startTime,j.bar="request.Started",this.startTimeTag.insertRows({startTime:j},i.firstChild),this.separatorTag.insertRows({label:Strings["request.phases.label"]},i.firstChild);var k=0,l=[],m=e.timings.blocked,n=e.timings.dns,o=e.timings.ssl,p=e.timings.connect,q=e.timings.send,r=e.timings.wait,s=e.timings.receive;m>=0&&l.push({bar:"request.phase.Blocking",elapsed:m,start:k}),n>=0&&l.push({bar:"request.phase.Resolving",elapsed:n,start:k+=m<0?0:m}),p>=0&&l.push({bar:"request.phase.Connecting",elapsed:p,start:k+=n<0?0:n}),q>=0&&l.push({bar:"request.phase.Sending",elapsed:q,start:k+=p<0?0:p}),r>=0&&l.push({bar:"request.phase.Waiting",elapsed:r,start:k+=q<0?0:q}),s>=0&&l.push({bar:"request.phase.Receiving",elapsed:s,start:k+=r<0?0:r,loaded:e.loaded,fromCache:e.fromCache}),this.timingsTag.insertRows({timings:l},i.firstChild);if(!f)return!0;var t=[];for(var u=0;u<b.phase.pageTimings.length;u++){var v=b.phase.pageTimings[u];t.push({bar:v.description?v.description:v.name,start:g+v.time-h,classes:v.classes,time:v.time})}t.length&&(t.sort(function(a,b){return a.time<b.time?-1:1}),this.separatorTag.insertRows({label:Strings["request.timings.label"]},i.firstChild),this.eventsTag.insertRows({events:t},i.firstChild));return!0}}),EntrySizeInfoTip=domplate({tag:DIV({"class":"sizeInfoTip"},"$file|getSize"),zippedTag:DIV(DIV({"class":"sizeInfoTip"},"$file|getBodySize"),DIV({"class":"sizeInfoTip"},"$file|getContentSize")),getSize:function(a){var b=a.response.bodySize;if(b<0)return Strings.unknownSize;return Lib.formatString(Strings.tooltipSize,Lib.formatSize(b),Lib.formatNumber(b))},getBodySize:function(a){var b=a.response.bodySize;if(b<0)return Strings.unknownSize;return Lib.formatString(Strings.tooltipZippedSize,Lib.formatSize(b),Lib.formatNumber(b))},getContentSize:function(a){var b=a.response.content.size;if(b<0)return Strings.unknownSize;return Lib.formatString(Strings.tooltipUnzippedSize,Lib.formatSize(b),Lib.formatNumber(b))},render:function(a,b,c){var d=a.input,e=b.repObject;if(e.response.bodySize==e.response.content.size)return this.tag.replace({file:e},c);return this.zippedTag.replace({file:e},c)}});return RequestList}})