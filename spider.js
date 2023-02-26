// modified chatgpt output

const spider = document.getElementById('spider');
const titleInput = document.getElementById('title');
const labelsInput = document.getElementById('values');
const minValueInput = document.getElementById('minValue');
const maxValueInput = document.getElementById('maxValue');

const retinaScaleInput = document.getElementById('retinaScale');

const previewBtn = document.getElementById('previewBtn');
const saveBtn = document.getElementById('saveBtn');
const savePNGBtn = document.getElementById('savePNGBtn');
const resetBtn = document.getElementById('resetBtn');

const fillColorInput = document.getElementById('fillColor');
const strokeColorInput = document.getElementById('strokeColor');
const textColorInput = document.getElementById('textColor');
const textShadowInput = document.getElementById('textShadow');

document.querySelectorAll("aside .flex>label").forEach(x=>x.title=x.innerText.slice(0,-1));
document.querySelectorAll("input").forEach(x=>x.setAttribute("defaultValue",x.value));

const formInputs = [titleInput,labelsInput,minValueInput,maxValueInput,fillColorInput,strokeColorInput,textColorInput,textShadowInput],
hex = ()=>btoa(JSON.stringify(formInputs.map(x=>x.value))),
load = hx=>{
	var h = JSON.parse(atob(hx));
	if (h.length<4) throw Error("idfk");
	formInputs.forEach((x,y)=>x.value=h[y]);
};


const drawSpiderDiagram = () => {
	
  history.pushState("","","?d="+hex());
  
  const title = titleInput.value;
  const values = JSON.parse(labelsInput.value);
  const labels = Object.keys(values);//labelsInput.value.split(',');
  const minValue = parseFloat(minValueInput.value);
  const maxValue = parseFloat(maxValueInput.value);
  const fill = fillColorInput.value;
  const strokeColor = strokeColorInput.value;
  const textColor = textColorInput.value;
  const stroke = strokeColorInput.value;
  const textShadow = textShadowInput.value;
  //const strokeColorInput.value;

  // Clear the SVG
  spider.innerHTML = '';
  
  var style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  style.innerHTML = "text{font-family:sans-serif;"+(textShadow>0?"filter:drop-shadow(0 0 "+textShadow+"px #000)":"")+"}";
  spider.appendChild(style);
  
  if (textShadow>0){
  }	  
  // Calculate the radius of the spider diagram
  const radius = (Math.min(spider.clientWidth, spider.clientHeight) / 2) - 50;
  
  console.log(radius);
  
  // Calculate the center of the spider diagram
  const center = { x: spider.clientWidth / 2, y: spider.clientHeight / 2 };
  
  // Calculate the angle between each label
  const angleStep = 2 * Math.PI / labels.length;
   
  
  
  // Draw the outerpoly
  const outerpoly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  outerpoly.setAttribute('fill', fill);
  outerpoly.setAttribute('stroke', stroke);
  outerpoly.setAttribute('opacity', ".5");
  outerpoly.setAttribute('stroke-width', '2');
  spider.appendChild(outerpoly);
  let outerpolyPoints = '';
  for (let i = 0; i < labels.length; i++) {
    const angle = angleStep * i - Math.PI / 2;
    const distance = (maxValue - minValue) / (maxValue - minValue) * radius;
    const point = {
      x: center.x + distance * Math.cos(angle),
      y: center.y + distance * Math.sin(angle),
    };
    outerpolyPoints += `${point.x},${point.y} `;
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', point.x);
    label.setAttribute('y', point.y);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('fill', textColor);
    label.setAttribute('dominant-baseline', 'middle');
    label.textContent = labels[i];
    spider.appendChild(label);
  }
  outerpoly.setAttribute('points', outerpolyPoints);
  
  
  // Draw the polygon
  const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  polygon.setAttribute('fill', fill);
  polygon.setAttribute('stroke', stroke);
  polygon.setAttribute('stroke-width', '2');
  spider.appendChild(polygon);
  let polygonPoints = '';
  for (let i = 0; i < labels.length; i++) {
    const angle = angleStep * i - Math.PI / 2;
    const value = values[labels[i]];//parseFloat(prompt(`Enter value for ${labels[i]}:`));
	
    const distance = (value - minValue) / (maxValue - minValue) * (radius - 20);
    const point = {
      x: center.x + distance * Math.cos(angle),
      y: center.y + distance * Math.sin(angle),
    };
    polygonPoints += `${point.x},${point.y} `;
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', point.x);
    label.setAttribute('y', point.y);
    label.setAttribute('fill', textColor);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('dominant-baseline', 'middle');
    label.textContent = value;
    spider.appendChild(label);
  }
  polygon.setAttribute('points', polygonPoints);
  
  // Draw the title
  const titleElem = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  titleElem.setAttribute('x', center.x);
  titleElem.setAttribute('y', center.y - radius - 20);
  titleElem.setAttribute('fill', textColor);
  titleElem.setAttribute('text-anchor', 'middle');
  titleElem.setAttribute('dominant-baseline', 'middle');
  titleElem.setAttribute('font-size', '20');
  titleElem.textContent = title;
  spider.appendChild(titleElem);
};

formInputs.forEach(x=>x.onkeyup=x.onchange=x.onclick=x.oninput=drawSpiderDiagram);

//previewBtn.addEventListener('click', drawSpiderDiagram);

saveBtn.addEventListener('click', ()=>{
  const svg = document.querySelector('svg').cloneNode(1);
  svg.removeAttribute("id");
  svg.setAttribute("version","1.0");
  svg.setAttribute("xmlns","http://www.w3.org/2000/svg");  
  const base64doc = btoa(unescape(encodeURIComponent(svg.outerHTML)));
  const a = document.createElement('a');
  const e = new MouseEvent('click');
  a.download = (titleInput.value||"spider-diagram")+'.svg';
  a.href = 'data:image/svg+xml;base64,' + base64doc;
  a.dispatchEvent(e);
});


function downloadSVGAsPNG(e){

  const scale = retinaScaleInput.value || 4;
  
  const canvas = document.createElement("canvas");
  //document.body.appendChild(canvas);
  const svg = document.querySelector('svg').cloneNode(1);
  svg.removeAttribute("id");
  svg.setAttribute("version","1.0");
  svg.setAttribute("xmlns","http://www.w3.org/2000/svg"); 
  svg.style.zoom=scale;
  const base64doc = btoa(unescape(encodeURIComponent(svg.outerHTML)));
  const w = parseInt(document.querySelector('svg').width.baseVal.value * scale);
  const h = parseInt(document.querySelector('svg').height.baseVal.value * scale);
  const img_to_download = document.createElement('img');
  img_to_download.src = 'data:image/svg+xml;base64,' + base64doc;
  console.log(w, h);
  img_to_download.onload = function () {
    console.log('img loaded');
    canvas.setAttribute('width', w);
    canvas.setAttribute('height', h);
    const context = canvas.getContext("2d");
    //context.clearRect(0, 0, w, h);
    context.drawImage(img_to_download,0,0,w,h);
    const dataURL = canvas.toDataURL('image/png');
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(canvas.msToBlob(), "download.png");
      e.preventDefault();
    } else {
      const a = document.createElement('a');
      const my_evt = new MouseEvent('click');
      a.download = 'download.png';
      a.href = dataURL;
      a.dispatchEvent(my_evt);
    }
	canvas.remove();
    //canvas.parentNode.removeChild(canvas);
  }  
}
savePNGBtn.addEventListener('click', downloadSVGAsPNG);

resetBtn.addEventListener('click', () => {if(confirm("are you sure? you will lose everything?"))formInputs.forEach(x=>x.value=x.getAttribute("defaultValue"))});
/*
resetBtn.addEventListener('click', () => {
  titleInput.value = '';
  labelsInput.value = '';
  minValueInput.value = '0';
  maxValueInput.value = '10';
  fillColorInput.value = '#02b116';
  strokeColorInput.value = '#70d77c';
  textColorInput.value = '#000';
  spider.innerHTML = '';
});*/

((s,k)=>{
    if (!!s && (k=s.split("#")[0].split("&")[0].split("?d=")[1])){
        load(k);
        drawSpiderDiagram()
    }
})(location.search)