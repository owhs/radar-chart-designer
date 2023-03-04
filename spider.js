// bits stolen from stack overflow
function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}
String.prototype.hexEncode = function(){
    var hex, i;

    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }

    return result
}
String.prototype.hexDecode = function(){
    var j;
    var hexes = this.match(/.{1,4}/g) || [];
    var back = "";
    for(j = 0; j<hexes.length; j++) {
        back += String.fromCharCode(parseInt(hexes[j], 16));
    }

    return back;
}
function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}


// start


const spider = document.getElementById('spider');
const titleInput = document.getElementById('title');
const labelsInput = document.getElementById('values');
const minValueInput = document.getElementById('minValue');
const maxValueInput = document.getElementById('maxValue');

const retinaScaleInput = document.getElementById('retinaScale');

const previewBtn = document.getElementById('previewBtn');
const saveBtn = document.getElementById('saveBtn');
const shareBtn = document.getElementById('shareBtn');
const savePNGBtn = document.getElementById('savePNGBtn');

const saveSpidBtn = document.getElementById('saveSpidBtn');
const openSpidBtn = document.getElementById('openSpidBtn');
const openEGBtn = document.getElementById('openEGBtn');

const fillColorInput = document.getElementById('fillColor');
const strokeColorInput = document.getElementById('strokeColor');
const ringColorInput = document.getElementById('ringColor');
const textColorInput = document.getElementById('textColor');
const highlightColorInput = document.getElementById('highlightColor');
const shadowColorInput = document.getElementById('shadowColor');
const textShadowInput = document.getElementById('textShadow');
const bgColor = document.getElementById('bgColor');
const noBg = document.getElementById('noBg');
const noNumbers = document.getElementById('noNumbers');

const darkMode = document.getElementById('darkMode');
const shareMode = document.getElementById('shareMode');

const labelDataTable = document.getElementById('data');

document.querySelectorAll("aside .flex>label").forEach(x=>x.title=x.title||x.innerText.slice(0,-1));
document.querySelectorAll("input").forEach(x=>x.setAttribute("defaultValue",x.value));


const formInputs = [titleInput,labelsInput,minValueInput,maxValueInput,fillColorInput,strokeColorInput,textColorInput,textShadowInput,highlightColorInput,shadowColorInput,ringColorInput,bgColor,noBg,noNumbers],
hex = ()=>btoa(fflate.strFromU8(fflate.compressSync(fflate.strToU8(JSON.stringify(formInputs.map(x=>x.matches("[type=checkbox]") ? +x.checked : x.value)).hexEncode())),true)),
addLabel = (l,d,f)=>{
	var el = document.createElement("div"), i1=document.createElement("input"), i2=document.createElement("input"), a=document.createElement("a");
		i1.value=l||"";
		i2.value=d||"";
		i2.setAttribute("type","number");
		i2.setAttribute("min",minValueInput.value);
		i2.setAttribute("max",maxValueInput.value);
		a.href="#";
		a.innerText="-";
		a.onclick=e=>{e.preventDefault();if(confirm("This will remove the label, are you sure?")) el.remove();parseData()};
		i1.onchange=i1.onclick=i1.onkeyup=i2.onchange=i2.onclick=i2.onkeyup=parseData;
		el.append(i1);
		el.append(i2);
		el.append(a);
		labelDataTable.append(el);
		document.querySelector("#titlebar>a+a+a").click();
		if (f){
			document.querySelector("#data>div:last-child input").select();
		}
},
load = hx=>{
	var h = JSON.parse(fflate.strFromU8(fflate.decompressSync(fflate.strToU8(atob(hx), true))).hexDecode());
	if (h.length<4) throw Error("idfk");
	formInputs.forEach((x,y)=>{
		if (!x.matches("[type=checkbox]")) x.value=h[y];
		else {x[h[y] ? "setAttribute" : "removeAttribute"]("checked","")}
	});
	var table = document.querySelector(".table");
	table.innerHTML="";
	JSON.parse(formInputs[1].value).forEach(ar=>{
		addLabel(ar[0],ar[1]);
	});
};

function parseData(){
    var ins = labelDataTable.querySelectorAll("input"),
        arr = [];
    for (var i = 0; i<ins.length;i=i+2){
        arr.push([ins[i].value,+ins[i+1].value]);
    }
    labelsInput.value=JSON.stringify(arr);
    drawSpiderDiagram();
    return arr;
}

var title = "",
	radius, center;

const drawSpiderDiagram = () => {
  var hx = hex();
  if (shareMode.checked){
	  history.replaceState("","","?d="+hx);
  } else history.replaceState("","","?");
  saveSpidBtn.setAttribute("title", hx.length +" bytes");
  
  title = titleInput.value;
  const values = JSON.parse(labelsInput.value);
  const labels = values.map(z=>z[0]);
  
  var limits = [...new Set(values.map(v=>v[1]))].sort((a,b)=>a-b);
  maxValueInput.setAttribute("min",limits[limits.length-1]);
  minValueInput.setAttribute("max", limits[0]);
  
  
  const minValue = parseFloat(minValueInput.value);
  const maxValue = parseFloat(maxValueInput.value);
  const fill = fillColorInput.value;
  const strokeColor = strokeColorInput.value;
  const highlightColor = highlightColorInput.value;
  const shadowColor = shadowColorInput.value;
  const ringColor = ringColorInput.value;
  const textColor = textColorInput.value;
  const stroke = strokeColorInput.value;
  const textShadow = textShadowInput.value;

  // Clear the SVG
  spider.innerHTML = '';
  
  var style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  style.innerHTML = "text{user-select:none;text-anchor:middle;dominant-baseline:middle;font-family:sans-serif;fill:"+textColorInput.value+";"+(textShadow>0?"filter:drop-shadow(0 0 "+textShadow+"px "+shadowColor+");text-shadow:0 0 "+(textShadow)+"px "+shadowColor+";":"")+"}"
					+ "svg>text{font-size:xx-large}"
					+"circle{opacity:.3;stroke-width:.5;fill:none;stroke:"+ringColor+"}circle:first-of-type{fill:"+fill+"}#values>g>circle{opacity:0.7;fill:"+textColorInput.value+";stroke-width:1;stroke:"+stroke+"}"
					+"polygon{stroke-width:1px;opacity:.7;fill:"+fill+";stroke:"+stroke+"}"
					+"#values>g>*{transition:fill.4s}#values>g:hover>*{fill:"+highlightColor+"}"
					+ (noBg.checked ? "" : "svg{background:"+bgColor.value+"}");
  spider.appendChild(style);
  
  if (textShadow>0){
  }	  
  // Calculate the radius of the spider diagram
  radius = (Math.min(spider.clientWidth, spider.clientHeight) / 2) - 50;
    
  // Calculate the center of the spider diagram
  center = { x: spider.clientWidth / 2, y: (spider.clientHeight / 2) + 25 };
  
  // Calculate the angle between each label
  const angleStep = 2 * Math.PI / labels.length;
   
  //console.log(center, radius);
  
  // Draw the title
  const titleElem = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  titleElem.setAttribute('x', center.x);
  titleElem.setAttribute('y', center.y - radius - 50);	
  titleElem.textContent = title;
  titleElem.onclick=()=>{
	  document.querySelector("#titlebar>a+a+a").click();
	  document.querySelector("#title").focus()
  };
  spider.appendChild(titleElem);
  
  
  var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.id="rings";
  for (var i=0;i<maxValue;i++){
	  var outerPerimeter = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	  outerPerimeter.setAttribute('cx', center.x);
	  outerPerimeter.setAttribute('cy', center.y);
	  outerPerimeter.setAttribute('r', ((radius/maxValue)*(maxValue-i)));
	  group.appendChild(outerPerimeter);
  }
  spider.appendChild(group);
  
  
  
  // Draw the polygon
  const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  spider.appendChild(polygon);
  let polygonPoints = '';
  group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.id="values";
  
  for (let i = 0; i < labels.length; i++) {
	var gr = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const angle = angleStep * i - Math.PI / 2;
    const value = values[i][1];
	
    var distance = (radius + 10);
    var point = {
      x: center.x + distance * Math.cos(angle),
      y: center.y + distance * Math.sin(angle),
    };

	
	var val = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    val.setAttribute('x', point.x);
    val.setAttribute('y', point.y);
    val.textContent = values[i][0];
	
	
    distance = (value - minValue) / (maxValue - minValue) * (((radius/maxValue)*(maxValue-2)));
    point = {
      x: center.x + distance * Math.cos(angle),
      y: center.y + distance * Math.sin(angle),
    };
	
    var label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', point.x);
    label.setAttribute('y', point.y);
	
    label.textContent = value;
	distance = (value - minValue) / (maxValue - minValue) * (radius);
    point = {
      x: center.x + distance * Math.cos(angle),
      y: center.y + distance * Math.sin(angle),
    };
	var pin = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	pin.setAttribute('cx', point.x);
	pin.setAttribute('cy', point.y);
	pin.setAttribute('r', 5);
	gr.appendChild(pin);
    if (noNumbers.checked) gr.appendChild(label);
    gr.appendChild(val);
	gr.onclick=e=>{
		var t = e.target, p = t.closest("g"), r = p.parentElement, z = [...r.children].indexOf(p), d = document.querySelectorAll("#data>div")[z].querySelectorAll("input");
		document.querySelector("#titlebar>a+a+a").click();
		d[[...p.children].indexOf(t)<2 ? 1 : 0].select();
	};
	group.appendChild(gr);
    polygonPoints += `${point.x},${point.y} `;
  }
  spider.appendChild(group);
  polygon.setAttribute('points', polygonPoints);
  
};

formInputs.forEach(x=>x.onkeyup=x.onchange=x.onclick=x.oninput=drawSpiderDiagram);


minValueInput.addEventListener("change",e=>{
	document.querySelectorAll("#data input[type=number]").forEach(i=>i.setAttribute("min",minValueInput.value))
});
maxValueInput.addEventListener("change",e=>{
	document.querySelectorAll("#data input[type=number]").forEach(i=>i.setAttribute("max",maxValueInput.value))
});


darkMode.addEventListener("change",e=>{
	document.querySelector("html").classList[darkMode.checked ? "add" : "remove"]("dark");
});

window.addEventListener('resize', drawSpiderDiagram, true);

saveBtn.addEventListener('click', ()=>{
  const svg = document.querySelector('svg').cloneNode(1);
  svg.removeAttribute("id");
  svg.setAttribute("version","1.0");
  svg.setAttribute("xmlns","http://www.w3.org/2000/svg");
  svg.setAttribute("viewBox", radius + " " + (titleInput.value ? 0 : 50) + " " + (center.x+60) + " " + (center.x+(titleInput.value ? 50 : 0)));
  const base64doc = btoa(unescape(encodeURIComponent(svg.outerHTML)));
  const a = document.createElement('a');
  const e = new MouseEvent('click');
  a.download = (title||titleInput.value||"spider-diagram")+'.svg';
  a.href = 'data:image/svg+xml;base64,' + base64doc;
  a.dispatchEvent(e);
});


function downloadSVGAsPNG(e){

  const scale = retinaScaleInput.value || 4;
  
  const canvas = document.createElement("canvas");
  const svg = document.querySelector('svg').cloneNode(1);
  svg.removeAttribute("id");
  svg.setAttribute("version","1.0");
  svg.setAttribute("xmlns","http://www.w3.org/2000/svg"); 
  svg.setAttribute("viewBox", radius + " " + (titleInput.value ? 0 : 50) + " " + (center.x+60) + " " + (center.x+(titleInput.value ? 60 : 0)));
  svg.style.zoom=scale;
  const base64doc = btoa(unescape(encodeURIComponent(svg.outerHTML)));
  const w = parseInt((center.x+60) * scale);
  const h = parseInt((center.x+(titleInput.value ? 60 : 0)) * scale);
  const img_to_download = document.createElement('img');
  img_to_download.src = 'data:image/svg+xml;base64,' + base64doc;
  img_to_download.onload = function () {
    canvas.setAttribute('width', w);
    canvas.setAttribute('height', h);
    const context = canvas.getContext("2d");
    context.drawImage(img_to_download,0,0,w,h);
    const dataURL = canvas.toDataURL('image/png');
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(canvas.msToBlob(), (title||titleInput.value||"spider-diagram")+".png");
      e.preventDefault();
    } else {
      const a = document.createElement('a');
      const my_evt = new MouseEvent('click');
      a.download = (title||titleInput.value||"spider-diagram")+'.png';
      a.href = dataURL;
      a.dispatchEvent(my_evt);
    }
	canvas.remove();
  }  
}
savePNGBtn.addEventListener('click', downloadSVGAsPNG);

saveSpidBtn.addEventListener('click', ()=>{
	download((title||titleInput.value||"spider-diagram")+'.spd',hex());
});
openEGBtn.addEventListener('click', ()=>{
	if (confirm("Are you sure? You will lose any progress!")){load('H4sIAB5kA2QAA62TURLCIAxErxRBUK+jvf8Z3IftTKS0hU4/MiEhLyxkMEtvsxDMcjJ7POVvsklrk//88uwHrfHUF5vjUgMz9yCOipd9uKi+ST1ZH7Kc4dk4wFLrWV2im71XrPLdLLWefQ2waDx7Lu/q2TzAorFxbuHdvPWk/7H61LmgBPmMlyZmyCzouaoT27K6LusuLau17HG87Vb/Xh1X6S1al78xfQHEA72OeAMAAA==');parseData()}
});
openSpidBtn.addEventListener('click', ()=>{
	var input = document.createElement('input');
	input.type = 'file';
	input.setAttribute("accept",".spd");
	input.onchange = e => { 
	   var file = e.target.files[0]; 
	   var reader = new FileReader();
	   reader.readAsText(file,'UTF-8');
	   reader.onload = readerEvent => {
		  var content = readerEvent.target.result;
		  load(content);
		  parseData();
	   }
	}
	input.click();
});


var tit = document.querySelector("#titlebar");
tit.onclick=e=>{
	e.preventDefault();
    var t = e.target, txt = t.innerText, a=document.querySelector("div>aside");
	if (t.matches(".logo") && confirm("Are you sure? You will lose any progress!")) location.search="";
	if (!t.matches("a")||!txt) return;
    tit.querySelector("#titlebar .active").classList.remove("active");
    t.classList.add("active");
    a.setAttribute("v",txt);
};

document.querySelector(".flex>aside>.diagram>.add").onclick=()=>{addLabel("label",Math.round((maxValueInput.value-minValueInput.value)/2),1);parseData()};

((s,k)=>{
    if (!!s && (k=s.split("#")[0].split("&")[0].split("?d=")[1])){
        load(k);
        drawSpiderDiagram()
    }
})(location.search)
