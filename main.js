import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

const $ = id => document.getElementById(id);
const scene = new THREE.Scene();scene.background=new THREE.Color(0x10161b);scene.fog=new THREE.Fog(0x10161b,23,44);
const camera=new THREE.PerspectiveCamera(72,innerWidth/innerHeight,.1,80);camera.position.set(0,1.68,8.6);
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.55;$('scene').appendChild(renderer.domElement);
const controls=new PointerLockControls(camera,document.body);
const isTouchDevice=matchMedia('(pointer:coarse)').matches;
if(isTouchDevice)renderer.setPixelRatio(Math.min(devicePixelRatio,1.25));
let mobilePlaying=false;
const joystick={x:0,y:0};
let mobileRunning=false;
const hemi=new THREE.HemisphereLight(0xddeaff,0x927457,2.25);scene.add(hemi);
function mat(c,r=1){return new THREE.MeshStandardMaterial({color:c,roughness:r});}
function cube(x,y,z,w,h,d,m){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);mesh.position.set(x,y,z);scene.add(mesh);return mesh;}
const floor=mat(0x786e60),wall=mat(0xd9d0bc),dark=mat(0x283038),gold=mat(0xb08a52),base=mat(0xaaa18e);
cube(0,-.12,0,25,.24,26,floor);cube(0,4.7,0,25,.2,26,wall);cube(-12.5,2.3,0,.25,4.8,26,wall);cube(12.5,2.3,0,.25,4.8,26,wall);cube(0,2.3,-13,25,4.8,.25,wall);cube(0,2.3,13,25,4.8,.25,wall);
for(let i=-12;i<=12;i+=2.1){cube(i,.045,0,.028,.018,25,base);cube(0,.046,i,25,.018,.028,base)}
for(const x of [-8,-2,4,10]){const light=new THREE.PointLight(0xffe0b0,32,9,2);light.position.set(x,4.1,0);scene.add(light);cube(x,4.54,0,1.4,.08,.65,gold);}
function createRomanColumn(x,z){
 const stone=mat(0xc8bda8,.92),shadowStone=mat(0xb5a893,.96);
 const baseBlock=new THREE.Mesh(new THREE.BoxGeometry(1.15,.28,1.15),shadowStone);baseBlock.position.set(x,.14,z);scene.add(baseBlock);
 const lowerBase=new THREE.Mesh(new THREE.CylinderGeometry(.42,.5,.2,24),stone);lowerBase.position.set(x,.38,z);scene.add(lowerBase);
 const shaftHeight=3.62,shaftY=.48+shaftHeight/2;
 const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.24,.28,shaftHeight,28),stone);shaft.position.set(x,shaftY,z);scene.add(shaft);
 for(let i=0;i<12;i++){
  const angle=(Math.PI*2/12)*i;
  const flute=new THREE.Mesh(new THREE.BoxGeometry(.034,shaftHeight-.18,.034),shadowStone);
  flute.position.set(x+Math.cos(angle)*.245,shaftY,z+Math.sin(angle)*.245);
  flute.rotation.y=-angle;
  scene.add(flute);
 }
 const upperRing=new THREE.Mesh(new THREE.CylinderGeometry(.33,.27,.14,24),shadowStone);upperRing.position.set(x,4.2,z);scene.add(upperRing);
 const capital=new THREE.Mesh(new THREE.BoxGeometry(.78,.22,.78),stone);capital.position.set(x,4.38,z);scene.add(capital);
 const abacus=new THREE.Mesh(new THREE.BoxGeometry(.96,.12,.96),shadowStone);abacus.position.set(x,4.53,z);scene.add(abacus);
 const capBand=new THREE.Mesh(new THREE.CylinderGeometry(.18,.18,.08,20),shadowStone);capBand.position.set(x,4.08,z);scene.add(capBand);
}
for(const x of [-10.5,10.5])for(const z of [-10,10])createRomanColumn(x,z);

function createCreditsPanel(){
 // O quadro fica paralelo à parede esquerda (plano YZ), sem avançar para o salão.
 const canvas=document.createElement('canvas');
 canvas.width=1800;canvas.height=1080;
 const ctx=canvas.getContext('2d');
 ctx.fillStyle='#f2ead9';ctx.fillRect(0,0,1800,1080);
 ctx.strokeStyle='#b08a52';ctx.lineWidth=20;ctx.strokeRect(28,28,1744,1024);
 ctx.strokeStyle='#c8b895';ctx.lineWidth=4;ctx.strokeRect(58,58,1684,964);
 const green='#11583e';
 ctx.textAlign='center';ctx.fillStyle=green;
 ctx.font='bold 61px Georgia';ctx.fillText('CRÉDITOS E AGRADECIMENTOS',900,145);
 ctx.strokeStyle=green;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(550,179);ctx.lineTo(1250,179);ctx.stroke();
 const lines=[
  ['Desenvolvido por alunos da UFABC.',true],
  ['',false],
  ['Agradecemos aos alunos da EJA do Ensino Médio',false],
  ['da EE Américo Brasiliense pela visita e participação.',false],
  ['',false],
  ['Este projeto busca apresentar, de forma simples e lúdica,',false],
  ['a relação entre a História da Arte e a representação',false],
  ['biológica e física de seres humanos, animais, plantas',false],
  ['e ambientes ao longo do tempo.',false],
  ['',false],
  ['Esperamos que curtam este passeio sem sair das cadeiras!',true],
  ['',false],
  ['Um agradecimento especial à professora',false],
  ['Meiri Aparecida Gurgel de Campos Miranda',true],
  ['e aos alunos da graduação envolvidos na atividade.',false]
 ];
 let y=245;
 for(const [line,highlight] of lines){
  if(!line){y+=22;continue;}
  ctx.font=highlight?'bold 39px Arial':'39px Arial';
  ctx.fillStyle=highlight?green:'#25322b';
  ctx.fillText(line,900,y,1630);
  y+=55;
 }
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
 // Caixa: profundidade no eixo X; largura ao longo de Z.
 cube(-12.27,2.37,0,.13,3.77,8.56,gold);
 cube(-12.18,2.37,0,.07,3.49,8.28,dark);
 const panel=new THREE.Mesh(
  new THREE.PlaneGeometry(8.02,3.25),
  new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide})
 );
 panel.position.set(-12.13,2.37,0);
 panel.rotation.y=Math.PI/2;
 scene.add(panel);
}
createCreditsPanel();

// Decoração da galeria: tapete, plantas e quadros fotográficos substituíveis.
function addCarpet(){
 const burgundy=mat(0x8b2133,.96),edge=mat(0xd3b27d,.85);
 // O tapete acompanha a parede esquerda, diante dos agradecimentos.
 cube(-10.40,.065,0,3.25,.065,9.5,burgundy);
 for(const x of [-11.91,-8.89])cube(x,.105,0,.055,.01,9.23,edge);
 for(const z of [-4.58,4.58])cube(-10.40,.105,z,3.09,.01,.055,edge);
}
addCarpet();

function createPottedPlant(x,z,scale=1){
 const pot=mat(0x977056,.88),rim=mat(0x77513d,.9),soil=mat(0x493e31,1);
 const green1=mat(0x275d3c,.93),green2=mat(0x3b784a,.93),green3=mat(0x1f4c34,.93);
 const plant=new THREE.Group();plant.position.set(x,0,z);plant.scale.setScalar(scale);scene.add(plant);
 function part(geometry,material,px,py,pz){const m=new THREE.Mesh(geometry,material);m.position.set(px,py,pz);plant.add(m);return m;}
 part(new THREE.CylinderGeometry(.33,.25,.63,14),pot,0,.33,0);
 part(new THREE.CylinderGeometry(.37,.37,.10,14),rim,0,.65,0);
 part(new THREE.CylinderGeometry(.315,.315,.025,14),soil,0,.71,0);
 part(new THREE.CylinderGeometry(.052,.075,.9,9),rim,0,1.10,0);
 const layers=[{h:1.13,r:.36,n:7},{h:1.52,r:.47,n:9},{h:1.91,r:.27,n:7}];
 for(let l=0;l<layers.length;l++){
  const layer=layers[l];
  for(let i=0;i<layer.n;i++){
   const a=i/layer.n*Math.PI*2+l*.4;
   const leaf=part(new THREE.SphereGeometry(.12,8,6),[green1,green2,green3][(i+l)%3],Math.cos(a)*layer.r,layer.h+Math.sin(i*2.4)*.09,Math.sin(a)*layer.r);
   leaf.scale.set(.9,2.1,.7);
   leaf.rotation.z=Math.cos(a)*.35;
  }
 }
 part(new THREE.SphereGeometry(.22,10,8),green2,0,2.08,0);
}
// Quatro vasos próximos às extremidades das paredes, sem cobrir os quadros.
for(const [x,z] of [[-10.7,-9.0],[-10.7,9.0],[10.7,-9.0],[10.7,9.0]])createPottedPlant(x,z,.95);

// As quatro imagens são placeholders. Para exibir fotos reais, coloque arquivos
// em images/ufabc-1.jpg ... ufabc-4.jpg e atualize a página.
function universityPlaceholder(label,index){
 const c=document.createElement('canvas');c.width=840;c.height=560;
 const g=c.getContext('2d');
 const sky=g.createLinearGradient(0,0,0,560);sky.addColorStop(0,'#a9cbd0');sky.addColorStop(.7,'#ece5d1');sky.addColorStop(1,'#a4aa90');
 g.fillStyle=sky;g.fillRect(0,0,840,560);
 g.fillStyle='#c7d0c8';g.fillRect(80,235,690,210);
 g.fillStyle='#71897f';g.fillRect(135,195,410,245);
 g.fillStyle='#dfe1d2';g.fillRect(560,160,150,280);
 for(let row=0;row<4;row++)for(let col=0;col<8;col++){g.fillStyle=(row+col+index)%3===0?'#668d95':'#c4d7d0';g.fillRect(165+col*44,222+row*48,28,30)}
 for(let row=0;row<5;row++)for(let col=0;col<2;col++){g.fillStyle='#8ca9a8';g.fillRect(577+col*64,184+row*45,43,29)}
 g.fillStyle='#75856f';g.fillRect(0,430,840,130);
 g.fillStyle='rgba(15,45,32,.85)';g.fillRect(0,463,840,97);
 g.textAlign='center';g.fillStyle='#fff9e9';g.font='bold 35px Arial';g.fillText(label,420,509);
 g.font='19px Arial';g.fillText('IMAGEM ILUSTRATIVA · SUBSTITUIR POR FOTO',420,538);
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
function addUniversityFrame(side,z,index,title){
 const x=side==='left'?-12.14:12.14;
 const panelY=2.36;
 const titleCanvas=document.createElement('canvas');titleCanvas.width=640;titleCanvas.height=100;
 const tg=titleCanvas.getContext('2d');tg.fillStyle='#e9e0cc';tg.fillRect(0,0,640,100);tg.fillStyle='#14563d';tg.font='bold 32px Arial';tg.textAlign='center';tg.fillText(title,320,61);
 const nameTex=new THREE.CanvasTexture(titleCanvas);nameTex.colorSpace=THREE.SRGBColorSpace;
 const sign=new THREE.Mesh(new THREE.PlaneGeometry(2.6,.39),new THREE.MeshBasicMaterial({map:nameTex,side:THREE.DoubleSide}));
 sign.position.set(side==='left'?-12.105:12.105,.81,z);sign.rotation.y=side==='left'?Math.PI/2:-Math.PI/2;scene.add(sign);
 // Moldura paralela às paredes laterais (largura no eixo Z).
 cube(side==='left'?-12.25:12.25,panelY,z,.12,2.38,3.23,gold);
 cube(side==='left'?-12.17:12.17,panelY,z,.07,2.18,3.03,dark);
 const photo=new THREE.Mesh(new THREE.PlaneGeometry(2.84,1.99),new THREE.MeshBasicMaterial({map:universityPlaceholder(title,index),side:THREE.DoubleSide}));
 photo.position.set(side==='left'?-12.11:12.11,panelY,z);photo.rotation.y=side==='left'?Math.PI/2:-Math.PI/2;scene.add(photo);
 const loader=new THREE.TextureLoader();
 loader.load('./images/ufabc-'+index+'.jpg',texture=>{
  texture.colorSpace=THREE.SRGBColorSpace;
  // Recorte central sem deformar imagens em formatos diferentes.
  const image=texture.image, ratio=image.width/image.height, frameRatio=2.84/1.99;
  texture.wrapS=THREE.ClampToEdgeWrapping;texture.wrapT=THREE.ClampToEdgeWrapping;
  if(ratio>frameRatio){texture.repeat.set(frameRatio/ratio,1);texture.offset.x=(1-texture.repeat.x)/2;}
  else{texture.repeat.set(1,ratio/frameRatio);texture.offset.y=(1-texture.repeat.y)/2;}
  photo.material.map.dispose();photo.material.map=texture;photo.material.needsUpdate=true;
 },undefined,()=>{});
}
addUniversityFrame('left',-8,1,'UFABC · CAMPUS SBC');
addUniversityFrame('left',8,2,'UFABC · CAMPUS SA');
addUniversityFrame('right',-5.5,3,'UFABC · LABORATÓRIO');
addUniversityFrame('right',5.5,4,'UFABC · CAMPUS SBC');


// Exposição comemorativa entre os dois quadros da parede direita.
// Os objetos são modelos 3D autorais e estilizados, não réplicas exatas.
function addUniversityMiniExhibition(){
 const darkGreen=mat(0x12553c,.72), ivory=mat(0xe3dbc7,.78), brass=mat(0xc49a55,.57), charcoal=mat(0x343e43,.76);
 const terracotta=mat(0x967355,.98), capyBrown=mat(0x987453,.95), capyDark=mat(0x493426,.96);
 function part(group,geometry,material,x,y,z){
  const mesh=new THREE.Mesh(geometry,material);
  mesh.position.set(x,y,z);group.add(mesh);return mesh;
 }
 function captionTexture(title,subtitle){
  const c=document.createElement('canvas');c.width=1000;c.height=240;
  const g=c.getContext('2d');g.fillStyle='#eae3d5';g.fillRect(0,0,1000,240);
  g.fillStyle='#13543a';g.textAlign='center';g.font='bold 66px Arial';g.fillText(title,500,100);
  g.fillStyle='#343b34';g.font='38px Arial';g.fillText(subtitle,500,170);
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
 }
 // Faixa de apresentação afixada à parede direita, voltada para a sala.
 const sign=new THREE.Mesh(new THREE.PlaneGeometry(4.6,1.08),new THREE.MeshBasicMaterial({map:captionTexture('ORGULHO UFABC','Ciência, criatividade e comunidade'),side:THREE.DoubleSide}));
 sign.position.set(12.10,3.55,0);sign.rotation.y=-Math.PI/2;scene.add(sign);
 // Dois pedestais compactos, sem bloquear a passagem pelo centro do salão.
 function pedestal(z,label,sub){
  const g=new THREE.Group();g.position.set(10.7,0,z);scene.add(g);
  part(g,new THREE.CylinderGeometry(.68,.78,.12,24),brass,0,.08,0);
  part(g,new THREE.CylinderGeometry(.57,.66,.85,24),ivory,0,.54,0);
  part(g,new THREE.CylinderGeometry(.71,.65,.12,24),darkGreen,0,1.03,0);
  const tag=new THREE.Mesh(new THREE.PlaneGeometry(1.22,.32),new THREE.MeshBasicMaterial({map:captionTexture(label,sub),side:THREE.DoubleSide}));
  tag.position.set(-.62,.58,0);tag.rotation.y=-Math.PI/2;g.add(tag);
  return g;
 }
 // Foguete Aracê (representação simbólica, com aletas e nose cone).
 const rocketStand=pedestal(-1.35,'UFABC ROCKET','IREC 2025');
 const r=new THREE.Group();r.position.set(0,1.10,0);rocketStand.add(r);
 part(r,new THREE.CylinderGeometry(.13,.13,1.18,20),ivory,0,.72,0);
 part(r,new THREE.ConeGeometry(.13,.38,20),darkGreen,0,1.50,0);
 part(r,new THREE.CylinderGeometry(.15,.15,.14,20),brass,0,.12,0);
 part(r,new THREE.CylinderGeometry(.137,.137,.11,20),darkGreen,0,1.13,0);
 for(let i=0;i<4;i++){
  const a=i*Math.PI/2;
  const fin=part(r,new THREE.BoxGeometry(.26,.37,.055),darkGreen,Math.cos(a)*.19,.24,Math.sin(a)*.19);
  fin.rotation.y=-a;
 }
 part(r,new THREE.CylinderGeometry(.045,.045,.12,12),charcoal,0,.025,0);
 // Capivara estilizada, criada apenas com primitivas 3D.
 const capyStand=pedestal(1.35,'CAPIVARA','Símbolo afetivo');
 const c=new THREE.Group();c.position.set(0,1.07,0);capyStand.add(c);
 const body=part(c,new THREE.SphereGeometry(.43,16,12),capyBrown,0,.34,0);body.scale.set(1.20,.72,.73);
 const head=part(c,new THREE.SphereGeometry(.24,14,10),capyBrown,-.38,.50,0);head.scale.set(1.15,.97,.92);
 part(c,new THREE.SphereGeometry(.12,10,8),capyDark,-.60,.38,0).scale.set(.7,.55,1.1);
 for(const z of [-.16,.16]){
  part(c,new THREE.SphereGeometry(.064,10,8),capyBrown,-.38,.75,z);
  part(c,new THREE.SphereGeometry(.021,8,6),capyDark,-.46,.54,z>0?.20:-.20);
 }
 for(const x of [-.32,.29])for(const z of [-.22,.22])part(c,new THREE.CylinderGeometry(.075,.085,.25,9),capyBrown,x,.10,z);
 // Óculos de sol cartunesco para a capivara, mais estável e encaixado no rosto.
 const glasses=new THREE.Group();glasses.position.set(-.50,.57,0);glasses.rotation.y=Math.PI/2;c.add(glasses);
 const lensMat=mat(0x0f1318,.18),frameMat=mat(0x171c20,.5);
 const leftLens=part(glasses,new THREE.BoxGeometry(.11,.08,.02),lensMat,0,0,.085);
 const rightLens=part(glasses,new THREE.BoxGeometry(.11,.08,.02),lensMat,0,0,-.085);
 part(glasses,new THREE.BoxGeometry(.022,.015,.13),frameMat,0,0,0);
 part(glasses,new THREE.BoxGeometry(.02,.012,.11),frameMat,.035,.005,.15);
 part(glasses,new THREE.BoxGeometry(.02,.012,.11),frameMat,.035,.005,-.15);
 // Pequena torre-relógio em relevo entre o foguete e a capivara.
 const clock=new THREE.Group();clock.position.set(11.86,1.45,0);scene.add(clock);
 part(clock,new THREE.BoxGeometry(.20,1.05,.42),ivory,0,.55,0);
 part(clock,new THREE.BoxGeometry(.26,.15,.58),brass,0,1.12,0);
 part(clock,new THREE.ConeGeometry(.37,.36,4),darkGreen,0,1.37,0).rotation.y=Math.PI/4;
 const face=new THREE.Mesh(new THREE.CircleGeometry(.14,24),new THREE.MeshBasicMaterial({color:0xfff3d5,side:THREE.DoubleSide}));
 face.rotation.y=-Math.PI/2;face.position.set(-.115,.88,0);clock.add(face);
 part(clock,new THREE.BoxGeometry(.025,.085,.018),charcoal,-.132,.915,0);
 part(clock,new THREE.BoxGeometry(.025,.018,.07),charcoal,-.135,.88,-.028);
}
addUniversityMiniExhibition();

// Pinturas demonstrativas criadas programaticamente, NÃO reproduções de obras históricas.
const exhibits=[
 {era:'SALA I · ANTIGUIDADE',title:'O corpo idealizado',subtitle:'Escultura e cânones gregos',desc:'Na arte grega clássica, muitos corpos de atletas, heróis e divindades enfatizavam equilíbrio, harmonia e proporções idealizadas. Não era uma tentativa universal de copiar cada detalhe do corpo real.',bio:'Os artistas observavam músculos, movimento e proporções. A imagem do corpo dialogava com valores culturais e ideias de beleza, não apenas com conhecimentos anatômicos.',question:'Que diferenças você percebe entre um corpo observado e um corpo idealizado?',palette:['#b68b61','#e3cda1','#58463a'],style:0,x:-8.5},
 {era:'SALA II · RENASCIMENTO',title:'O corpo investigado',subtitle:'Arte e estudo anatômico',desc:'Durante o Renascimento europeu, artistas como Leonardo da Vinci estudaram estrutura, proporções e movimento corporal. Desenhos e dissecações aprofundaram as relações entre observação artística e anatomia.',bio:'O estudo de músculos, esqueleto e articulações contribuiu para representações mais informadas e também para comunicar conhecimentos sobre o corpo.',question:'Como observar ossos e músculos pode ajudar alguém a desenhar uma pessoa?',palette:['#b4a17f','#e2d8b9','#584c38'],style:1,x:-2.9},
 {era:'SALA III · ILUSTRAÇÃO CIENTÍFICA',title:'O corpo documentado',subtitle:'Arte a serviço da explicação',desc:'Em diferentes épocas da ciência moderna, ilustrações de anatomia tornaram estruturas internas mais visíveis e organizadas para estudo e ensino. A imagem científica também envolve escolhas de composição e destaque.',bio:'Ilustrações permitem estudar sistemas do corpo, comparar órgãos e explicar estruturas que não vemos na superfície.',question:'Por que um desenho científico pode mostrar algo melhor que uma fotografia?',palette:['#587980','#c7d6ca','#273c43'],style:2,x:2.9},
 {era:'SALA IV · CONTEMPORANEIDADE',title:'O corpo em detalhe',subtitle:'Hiper-realismo e identidade',desc:'O hiper-realismo explora detalhes minuciosos, como rugas, textura da pele, poros e pelos. Alguns artistas usam essa aparência convincente para provocar reflexão sobre idade, identidade e percepção.',bio:'O interesse por textura, envelhecimento e diversidade de corpos dialoga com a observação biológica, enquanto materiais e tecnologias ampliam as possibilidades artísticas.',question:'Um corpo mais realista significa necessariamente uma obra de arte melhor?',palette:['#7b5a55','#d5aa8d','#392c31'],style:3,x:8.5}
];
function artTexture(ex){const c=document.createElement('canvas');c.width=720;c.height=930;const g=c.getContext('2d');const [bg,light,ink]=ex.palette;g.fillStyle=bg;g.fillRect(0,0,720,930);for(let i=0;i<26;i++){g.fillStyle=`rgba(255,255,255,${.015+(i%5)*.004})`;g.fillRect(0,i*38,720,3)}
 g.save();g.translate(360,510);
 if(ex.style===0){g.fillStyle=ink;g.fillRect(-130,255,260,35);g.fillStyle=light;g.beginPath();g.ellipse(0,-185,87,115,0,0,Math.PI*2);g.fill();g.beginPath();g.moveTo(-70,-90);g.lineTo(-155,-25);g.lineTo(-112,175);g.lineTo(-65,175);g.lineTo(-68,50);g.lineTo(-60,270);g.lineTo(0,270);g.lineTo(25,70);g.lineTo(65,270);g.lineTo(125,270);g.lineTo(95,-35);g.lineTo(155,170);g.lineTo(190,145);g.lineTo(147,-92);g.lineTo(78,-90);g.closePath();g.fill();g.strokeStyle=ink;g.lineWidth=5;g.beginPath();g.moveTo(-58,10);g.quadraticCurveTo(0,55,55,10);g.stroke()}
 if(ex.style===1){g.strokeStyle=ink;g.lineWidth=5;g.beginPath();g.arc(0,-245,79,0,Math.PI*2);g.moveTo(0,-165);g.lineTo(0,162);g.moveTo(-140,-130);g.lineTo(140,-130);g.moveTo(-140,-130);g.lineTo(-210,60);g.moveTo(140,-130);g.lineTo(210,60);g.moveTo(0,162);g.lineTo(-118,320);g.moveTo(0,162);g.lineTo(118,320);g.stroke();g.lineWidth=2;for(let j=0;j<12;j++){g.beginPath();g.ellipse(0,-90+j*15,90-j*3,25,0,Math.PI,Math.PI*2);g.stroke()}g.beginPath();g.arc(0,-55,260,0,Math.PI*2);g.stroke();g.beginPath();g.rect(-225,-320,450,670);g.stroke()}
 if(ex.style===2){g.strokeStyle=light;g.lineWidth=11;g.beginPath();g.moveTo(0,-340);g.lineTo(0,280);g.stroke();g.lineWidth=4;for(let i=0;i<18;i++){const y=-190+i*24;g.beginPath();g.ellipse(0,y,105-Math.abs(i-7)*4,22,0,0,Math.PI*2);g.stroke()}g.lineWidth=7;g.beginPath();g.arc(0,-285,72,0,Math.PI*2);g.stroke();g.fillStyle=light;g.font='28px Georgia';g.fillText('FIG. I  ·  ANATOMIA',-154,360)}
 if(ex.style===3){g.fillStyle=light;g.beginPath();g.ellipse(0,0,220,320,0,0,Math.PI*2);g.fill();g.strokeStyle=ink;g.lineWidth=9;g.beginPath();g.arc(-80,-55,12,0,Math.PI*2);g.arc(80,-55,12,0,Math.PI*2);g.stroke();g.beginPath();g.moveTo(0,-30);g.lineTo(-22,83);g.lineTo(27,83);g.stroke();g.beginPath();g.arc(0,135,65,.15,Math.PI-.15);g.stroke();g.lineWidth=2;for(let i=0;i<19;i++){const x=-156+i*17;g.beginPath();g.moveTo(x,165);g.lineTo(x+25,177);g.stroke()}for(let i=0;i<35;i++){const x=(i*59)%360-180;const y=(i*83)%420-220;g.fillStyle=ink;g.fillRect(x,y,2,2)}}
 g.restore();g.strokeStyle='rgba(255,255,255,.38)';g.lineWidth=5;g.strokeRect(20,20,680,890);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;ex.url=c.toDataURL('image/png');return t;}
// Conteúdo da Sala I. A pintura rupestre utiliza a imagem enviada pelo grupo;
// o Doríforo usa uma ilustração temporária, substituível em images/doriforo.jpg.
exhibits.push(
 {era:'SALA I · PRÉ-HISTÓRIA',title:'Arte rupestre: vida, animais e movimento',subtitle:'Pinturas rupestres · Pré-História',desc:'Pinturas rupestres registram animais, figuras humanas e cenas que podem estar associadas a experiências, práticas e crenças das comunidades que as produziram. Seus significados exatos variam e nem sempre são conhecidos.',bio:'Observar formas, proporções e movimentos dos animais exige atenção à vida ao redor. A representação não precisava ser anatomicamente exata para comunicar características reconhecíveis.',question:'Como você identifica que animal está desenhado, mesmo com poucos traços?',image:'./images/arte-rupestre.jpg',style:4},
 {era:'SALA I · ANTIGUIDADE',title:'O corpo ideal · Policleto (~440 a.C.)',subtitle:'Doríforo · Grécia clássica',desc:'Na arte grega clássica, o corpo humano era frequentemente representado buscando proporção, equilíbrio e harmonia. A figura não precisava retratar uma pessoa específica: expressava também um ideal de corpo. O Doríforo, atribuído ao escultor Policleto, é um exemplo de postura equilibrada e distribuição do peso.',bio:'A obra evidencia a observação de músculos, ossos, postura e movimento, mesmo antes da anatomia moderna. O conhecimento visual do corpo coexistia com ideias culturais sobre perfeição.',question:'Esse corpo representa uma pessoa real ou uma ideia de corpo perfeito?',image:'./images/grego.jpg',style:5},
 {era:'SALA I · EGITO ANTIGO',title:'O corpo simbólico no Egito',subtitle:'Pintura egípcia · figuração e convenção',desc:'Na arte egípcia, o corpo humano não era representado apenas como aparência física observada, mas também segundo convenções visuais muito claras. Era comum combinar diferentes pontos de vista no mesmo corpo, como cabeça e pernas de perfil e tronco de frente.',bio:'Essas escolhas mostram que representar o corpo não significa apenas copiar o real. A observação do ser humano se mistura a valores culturais, religião, hierarquia e formas de organização visual.',question:'Por que uma representação do corpo pode seguir regras simbólicas em vez de buscar o realismo?',image:'./images/egito.jpg',style:6},
 {era:'SALA I · TRADIÇÕES DO JAPÃO',title:'Corpo, natureza e delicadeza visual',subtitle:'Pintura japonesa · natureza e composição',desc:'Em muitas pinturas japonesas, figuras humanas, paisagens, flores e estações do ano se combinam de forma delicada. A composição, o vazio, o gesto e a relação com a natureza são tão importantes quanto a forma do corpo em si.',bio:'A representação de plantas, ambientes e seres vivos ajuda a perceber como arte e observação da natureza caminham juntas. O corpo aparece em diálogo com o espaço, com a estação e com a cultura.',question:'Como a presença da natureza pode mudar a forma como percebemos o corpo numa obra?',image:'./images/japones.jpg',style:7}
);

// Sala II — obras do sagrado à investigação do corpo e da natureza.
exhibits.push(
 {era:'SALA II · ARTE SACRA',title:'O corpo como representação do sagrado',subtitle:'Vitral medieval · Natividade',desc:'Na arte sacra medieval, imagens como os vitrais contavam histórias religiosas por meio de cores, gestos e símbolos. O objetivo não era necessariamente reproduzir o corpo humano com exatidão anatômica.',bio:'Mesmo sem privilegiar o realismo, a obra comunica atitudes, relações humanas e emoções pela posição e pelos gestos das figuras.',question:'Uma obra precisa representar o corpo realisticamente para transmitir uma mensagem?',image:'./images/vitral-sacro.png',style:8},
 {era:'SALA II · LEONARDO DA VINCI',title:'Homem Vitruviano: o corpo por fora e por dentro',subtitle:'Leonardo da Vinci · c. 1490',desc:'Leonardo investigou as proporções humanas relacionando arte, matemática e geometria. Em seus estudos anatômicos posteriores, explorou ossos, músculos, órgãos e movimentos por meio da observação e de dissecações.',bio:'Comparar o corpo visível com as estruturas internas ajuda a diferenciar proporção e aparência de anatomia e funcionamento.',question:'Qual é a diferença entre desenhar o corpo e compreender como ele funciona?',image:'./images/homem-vitruviano.png',anatomyImage:'./images/leonardo-anatomia.jpg',style:9},
 {era:'SALA II · MICHELANGELO',title:'Pietà: anatomia e expressão na escultura',subtitle:'Michelangelo · 1498–1499',desc:'A Pietà apresenta Maria segurando o corpo de Cristo. Michelangelo reuniu um tema religioso com atenção ao peso, à postura, aos músculos e ao caimento do tecido.',bio:'Os detalhes do corpo, as articulações e a distribuição do peso ajudam a produzir a sensação de um corpo real mesmo em pedra.',question:'Como uma escultura de mármore consegue sugerir peso e repouso?',image:'./images/pieta.png',style:10},
 {era:'SALA II · BOTÂNICA',title:'O Grande Tufo de Ervas: observar a natureza',subtitle:'Albrecht Dürer · 1503',desc:'Na obra O Grande Tufo de Ervas, Dürer observou e representou gramíneas e outras plantas comuns com atenção à diversidade de formas e detalhes.',bio:'Folhas, caules e variações entre espécies se tornam objeto de observação. A mesma curiosidade que investigava o corpo humano também se voltava para a natureza.',question:'O que conseguimos aprender observando cuidadosamente plantas do cotidiano?',image:'./images/durer-ervas.jpg',style:11}
);

// Sala III — Ciência e arte: óptica, anatomia, respiração e tecnologia.
exhibits.push(
 {era:'SALA III · BARROCO',title:'A Ceia em Emaús: luz e sombra',subtitle:'Caravaggio · 1601',desc:'Caravaggio cria uma cena dramática com iluminação dirigida, gestos e expressões. O contraste entre luz e sombra enfatiza o volume e direciona a atenção do observador.',bio:'A luz altera a percepção de rostos e corpos. A óptica estuda a propagação da luz e a formação de sombras; o olhar interpreta profundidade, forma e movimento.',question:'Como mudar a iluminação pode transformar a percepção de um rosto?',image:'./images/caravaggio.jpg',style:12},
 {era:'SALA III · ANATOMIA',title:'A Lição de Anatomia do Dr. Tulp',subtitle:'Rembrandt · 1632',desc:'A pintura apresenta uma demonstração anatômica conduzida pelo médico Nicolaes Tulp, diante de outros cirurgiões. O grupo observa o antebraço de um cadáver; a cena é também um retrato coletivo.',bio:'A dissecação revela músculos, tendões e relações entre estruturas internas. O contraste de luz realça o corpo estudado e conduz a observação.',question:'Por que observar estruturas internas ajuda a compreender o movimento do corpo?',image:'./images/rembrandt-tulp.jpg',style:13},
 {era:'SALA III · EXPERIÊNCIA CIENTÍFICA',title:'Experimento com um Pássaro numa Bomba de Ar',subtitle:'Joseph Wright of Derby · 1768',desc:'A pintura mostra espectadores diante de uma demonstração da retirada de ar de um recipiente com uma ave. A cena reúne curiosidade, medo e questões éticas sobre experimentos com seres vivos.',bio:'A pressão e a disponibilidade de gases são fundamentais para a respiração. A cena permite relacionar Física e Biologia sem reproduzir um experimento que coloque animais em risco.',question:'Qual é o papel do ar na respiração dos animais?',image:'./images/wright-passaro.jpg',style:14},
 {era:'SALA III · ROMANTISMO',title:'Chuva, Vapor e Velocidade',subtitle:'J. M. W. Turner · 1844',desc:'Turner retrata um trem avançando sob chuva e vapor, utilizando luz difusa, atmosfera e movimento para transmitir a força da tecnologia em meio à paisagem.',bio:'Movimento, vapor e dispersão da luz são fenômenos físicos. A obra também convida a pensar como a tecnologia transforma ambientes e a relação humana com a natureza.',question:'Como a tecnologia modifica nossa percepção e nossa relação com a paisagem?',image:'./images/turner-vapor.jpg',style:15}
);


// Sala IV — corpos diversos e arte contemporânea.
exhibits.push(
 {era:'SALA IV · ARTE CONTEMPORÂNEA',title:'Hymn: anatomia transformada em arte',subtitle:'Damien Hirst · 2000',desc:'A escultura monumental retoma a linguagem de modelos anatômicos educativos, expondo estruturas do corpo e questionando a fronteira entre objeto didático e objeto artístico.',bio:'A anatomia permite investigar músculos, órgãos e sistemas. Um modelo é uma representação simplificada do corpo, feita para destacar estruturas.',question:'Quando um modelo criado para ensinar ciência também pode ser considerado arte?',image:'./images/hirst-hymn.jpg',style:16},
 {era:'SALA IV · HIPER-REALISMO',title:'Old Woman in Bed: a passagem do tempo',subtitle:'Ron Mueck · 2000–2002',desc:'A escultura mostra uma mulher idosa em repouso, com detalhes de pele, expressão e postura que convidam a olhar o envelhecimento com atenção e humanidade.',bio:'Rugas, mudanças na pele e no corpo são manifestações naturais do envelhecimento. Cada pessoa envelhece de maneira particular.',question:'Por que uma pessoa idosa também deve ocupar o centro de uma obra de arte?',image:'./images/mueck-idosa.jpg',style:17},
 {era:'SALA IV · DIVERSIDADE CORPORAL',title:'Propped: corpos fora do ideal clássico',subtitle:'Jenny Saville · 1992',desc:'A pintura apresenta o corpo com volume e presença, questionando padrões restritos de beleza e a expectativa de que a arte precise idealizar a figura humana.',bio:'Corpos humanos variam em formas, medidas, composição e características da pele. Essa diversidade não se resume a um padrão único.',question:'Existe um único corpo considerado normal — e quem determina esse padrão?',image:'./images/saville-propped.jpg',style:18},
 {era:'SALA IV · GENTE COMUM',title:'Supermarket Lady: o cotidiano vira arte',subtitle:'Duane Hanson · 1969–1970',desc:'Uma mulher com carrinho de compras torna-se protagonista de uma escultura hiper-realista. A obra destaca o cotidiano e também pode provocar reflexões sobre consumo e padrões sociais.',bio:'Postura, características individuais e modos de ocupar o espaço são aspectos da experiência corporal cotidiana. Não precisamos ser heróis para sermos representados.',question:'Por que uma pessoa comum também merece um lugar no museu?',image:'./images/hanson-supermarket.jpg',style:19}
);

const paintings=[];
// Lobby sem telas-resumo: os atalhos serão criados após a configuração das portas.
// Percurso linear: lobby -> I -> II -> III -> IV -> lobby.
// Cada sala ocupa outra área do mundo 3D, e uma porta leva à próxima.
const ROOM_SPACING=38;
const museumRooms=[
 {x:ROOM_SPACING,name:'SALA I · QUATRO OLHARES SOBRE A NATUREZA E O CORPO',subtitle:'Do registro da natureza ao corpo ideal'},
 {x:ROOM_SPACING*2,name:'SALA II · DO SAGRADO À CIÊNCIA',subtitle:'Religião, proporções, anatomia e natureza'},
 {x:ROOM_SPACING*3,name:'SALA III · LUZ, CORPO E CIÊNCIA',subtitle:'Óptica, medicina, ar e movimento'},
 {x:ROOM_SPACING*4,name:'SALA IV · O CORPO COMO ELE É',subtitle:'Diversidade, envelhecimento e cotidiano'}
];
let currentRoom=-1;
const doors=[];
function makeSign(message,width=4.5,height=.68){
 const cv=document.createElement('canvas');cv.width=1024;cv.height=180;
 const cx=cv.getContext('2d');cx.fillStyle='#eee2cc';cx.fillRect(0,0,1024,180);
 cx.fillStyle='#13573e';cx.textAlign='center';cx.textBaseline='middle';
 let fontSize=54;
 do { cx.font=`bold ${fontSize}px Georgia`; fontSize-=2; }
 while(cx.measureText(message).width>900&&fontSize>24);
 cx.fillText(message,512,92,900);
 const tx=new THREE.CanvasTexture(cv);tx.colorSpace=THREE.SRGBColorSpace;
 return new THREE.Mesh(new THREE.PlaneGeometry(width,height),new THREE.MeshBasicMaterial({map:tx,side:THREE.DoubleSide}));
}
function placePortal(x,z,destination,label,side='back'){
 const doorMat=mat(0x164735,.7);
 const face=new THREE.Mesh(new THREE.PlaneGeometry(2.85,3.12),doorMat);
 face.position.set(x,1.56,z);if(side==='back')face.rotation.y=0;scene.add(face);
 // Moldura na frente da parede; em vez de um vão verdadeiro, E transporta para a sala adjacente.
 const trim=mat(0xb99765,.65);
 cube(x-1.53,1.63,z+.045,.16,3.35,.18,trim);
 cube(x+1.53,1.63,z+.045,.16,3.35,.18,trim);
 cube(x,3.27,z+.045,3.22,.16,.18,trim);
 const sign=makeSign(label,3.2,.5);sign.position.set(x,3.70,z+.14);scene.add(sign);
 face.userData.destination=destination;doors.push(face);
 return face;
}
function makeRoom(cx,meta,i){
 const wallMat=mat(0xd8d0c0,.98),tileMat=mat(0x817a70,.93),lineMat=mat(0xb9afa0,.9);
 // Salas fechadas e independentes; a transição se dá pela porta interativa.
 cube(cx,-.12,0,25,.24,26,tileMat);cube(cx,4.70,0,25,.20,26,wallMat);
 cube(cx-12.5,2.3,0,.26,4.8,26,wallMat);cube(cx+12.5,2.3,0,.26,4.8,26,wallMat);
 cube(cx,2.3,-13,25,4.8,.26,wallMat);cube(cx,2.3,13,25,4.8,.26,wallMat);
 for(let q=-11;q<=11;q+=2.2){cube(cx+q,.018,0,.018,.012,25,lineMat);cube(cx,.020,q,25,.012,.018,lineMat)}
 for(const x of [cx-7,cx+7]){const lamp=new THREE.PointLight(0xffe3be,26,12,2);lamp.position.set(x,4.15,0);scene.add(lamp);cube(x,4.54,0,1.6,.08,.6,gold)}
 const title=makeSign(meta.name,7.0,.64);title.position.set(cx,3.88,12.78);title.rotation.y=Math.PI;scene.add(title);
 placePortal(cx,-12.69,i===3?-1:i+1,i===3?'VOLTAR AO LOBBY':'PRÓXIMA SALA');
 // Texto explicativo fica à esquerda da saída, sem atravessar a porta.
 const label=makeSign(meta.subtitle,5.4,.52);label.position.set(cx-6.0,2.32,-12.65);scene.add(label);
}
museumRooms.forEach((r,i)=>makeRoom(r.x,r,i));
placePortal(-8.5,-12.65,0,'INICIAR O PERCURSO');
placePortal(-2.9,-12.65,1,'ATALHO · SALA II');
placePortal( 2.9,-12.65,2,'ATALHO · SALA III');
placePortal( 8.5,-12.65,3,'ATALHO · SALA IV');
for(const [x,label] of [[-2.9,'Ir direto ao Renascimento'],[2.9,'Ir direto à Ciência e Arte'],[8.5,'Ir direto à Contemporaneidade']]){
 const subtitle=makeSign(label,3.9,.46);subtitle.position.set(x,.45,-12.50);scene.add(subtitle);
}
// Sala I: quatro obras em ordem histórica.
function makePicture(cx,wallZ,exhibitIndex,title){
 const ex=exhibits[exhibitIndex];const x=cx;
 cube(x,2.14,wallZ,.13,3.2,4.5,gold); // esta moldura é substituída abaixo pela versão horizontal na parede
}
function addRoomCarpet(cx,z,side,length=3.1){
 const burgundy=mat(0x8b2133,.96),edge=mat(0xd5b67b,.8);
 const x=cx+(side==='left'?-9.8:9.8);
 cube(x,.06,z,2.35,.06,length,burgundy);
 for(const sx of [x-1.08,x+1.08])cube(sx,.095,z,.045,.008,length-.18,edge);
 for(const sz of [z-(length/2)+.06,z+(length/2)-.06])cube(x,.095,sz,2.18,.008,.045,edge);
}
function addRoomColumns(cx){for(const [x,z] of [[cx-10.5,-9.5],[cx-10.5,9.5],[cx+10.5,-9.5],[cx+10.5,9.5]])createRomanColumn(x,z)}
function addRoomPlants(cx){for(const [x,z] of [[cx-9.25,-8.3],[cx-9.25,8.3],[cx+9.25,-8.3],[cx+9.25,8.3]])createPottedPlant(x,z,.82)}
function makeExhibitFallback(exhibitIndex){
 const ex=exhibits[exhibitIndex];
 const c=document.createElement('canvas');c.width=920;c.height=650;const g=c.getContext('2d');
 if(exhibitIndex===4){
  const grad=g.createLinearGradient(0,0,0,650);grad.addColorStop(0,'#a66f43');grad.addColorStop(1,'#d19a66');g.fillStyle=grad;g.fillRect(0,0,920,650);
  g.fillStyle='#2e1208';
  const animals=[[160,170,1.2],[330,255,1.0],[515,190,1.1],[280,395,1.35],[525,420,1.22]];
  for(const [x,y,s] of animals){g.beginPath();g.ellipse(x,y,58*s,26*s,0,0,Math.PI*2);g.fill();g.beginPath();g.moveTo(x+45*s,y-12*s);g.lineTo(x+88*s,y-40*s);g.lineTo(x+58*s,y-2*s);g.closePath();g.fill();g.fillRect(x-35*s,y+15*s,8*s,40*s);g.fillRect(x+18*s,y+12*s,8*s,40*s);}
  for(let i=0;i<5;i++){const y=130+i*98;g.strokeStyle='#2e1208';g.lineWidth=8;g.beginPath();g.arc(760,y,32,Math.PI*1.1,Math.PI*1.9);g.stroke();g.beginPath();g.moveTo(760,y+30);g.lineTo(760,y+84);g.moveTo(760,y+54);g.lineTo(730,y+76);g.moveTo(760,y+54);g.lineTo(790,y+76);g.stroke();}
 }
 else if(exhibitIndex===5){
  g.fillStyle='#ddd5c2';g.fillRect(0,0,920,650);g.fillStyle='#35363a';g.fillRect(0,520,920,24);g.fillStyle='#e9d8ad';
  g.beginPath();g.ellipse(465,160,88,110,0,0,Math.PI*2);g.fill();g.beginPath();g.moveTo(382,255);g.lineTo(350,455);g.lineTo(412,455);g.lineTo(430,305);g.lineTo(465,525);g.lineTo(525,525);g.lineTo(495,310);g.lineTo(530,455);g.lineTo(592,455);g.lineTo(550,255);g.closePath();g.fill();
  g.strokeStyle='#64503f';g.lineWidth=10;g.beginPath();g.moveTo(420,300);g.quadraticCurveTo(470,340,520,300);g.stroke();
 }
 else if(exhibitIndex===6){
  g.fillStyle='#d3b27c';g.fillRect(0,0,920,650);g.fillStyle='#7a5130';g.fillRect(0,0,920,26);g.fillRect(0,624,920,26);
  for(let i=0;i<4;i++){g.fillStyle=i%2?'#935f37':'#f0d38a';g.fillRect(90+i*175,84,112,462);}g.fillStyle='#6d4027';
  const figures=[180,355,530,705];
  for(const x of figures){g.beginPath();g.arc(x,165,34,0,Math.PI*2);g.fill();g.fillRect(x-18,200,36,160);g.fillRect(x-55,225,110,28);g.fillRect(x-18,360,30,130);g.fillRect(x+5,360,30,130);} 
 }
 else if(exhibitIndex===7){
  g.fillStyle='#f5eee6';g.fillRect(0,0,920,650);g.fillStyle='#191919';g.fillRect(0,560,920,8);
  g.strokeStyle='#5c3c28';g.lineWidth=10;g.beginPath();g.moveTo(235,650);g.quadraticCurveTo(245,390,280,210);g.stroke();
  for(const [x,y,r] of [[305,140,26],[338,185,22],[322,228,20],[292,190,18],[350,145,16],[270,150,16],[365,215,15],[255,235,14]]){g.fillStyle='#f1a8b9';g.beginPath();for(let i=0;i<5;i++){const a=Math.PI/2+i*2*Math.PI/5;const px=x+Math.cos(a)*r,py=y+Math.sin(a)*r; i===0?g.moveTo(px,py):g.lineTo(px,py);const ia=a+Math.PI/5;g.lineTo(x+Math.cos(ia)*r*.46,y+Math.sin(ia)*r*.46);}g.closePath();g.fill();}
  g.fillStyle='#81644e';g.fillRect(565,355,145,120);g.fillStyle='#d8c0a5';g.beginPath();g.arc(635,298,42,0,Math.PI*2);g.fill();g.fillRect(605,340,60,132);g.fillStyle='#1c1c1c';g.beginPath();g.moveTo(627,350);g.lineTo(585,447);g.lineTo(685,447);g.closePath();g.fill();
 }
 g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=6;g.strokeRect(18,18,884,614);g.fillStyle='rgba(255,255,255,.86)';g.textAlign='center';g.font='bold 34px Georgia';g.fillText(ex.subtitle.toUpperCase(),460,603);
 const url=c.toDataURL('image/png');ex.fallbackUrl=url; const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
function createMiniParthenon(x,z){
 const stone=mat(0xd7c7a8,.94),shadow=mat(0xbaaa8c,.96),roof=mat(0xb79562,.82);
 cube(x,.10,z,4.1,.12,2.35,shadow);cube(x,.50,z,3.55,.38,1.75,stone);cube(x,.82,z,3.9,.10,2.02,roof);cube(x,1.82,z,3.55,.16,1.65,stone);cube(x,2.05,z,3.88,.12,1.96,roof);
 for(const px of [-1.25,-.42,.42,1.25]){const col=new THREE.Mesh(new THREE.CylinderGeometry(.11,.12,1.18,18),stone);col.position.set(x+px,1.33,z+.73);scene.add(col)}
 for(const px of [-1.25,-.42,.42,1.25]){const col=new THREE.Mesh(new THREE.CylinderGeometry(.11,.12,1.18,18),stone);col.position.set(x+px,1.33,z-.73);scene.add(col)}
}
function createMiniPyramid(x,z,scale=1){
 const sand=mat(0xc7a46a,.95),shadow=mat(0xa8844e,.96);
 const base=new THREE.Mesh(new THREE.CylinderGeometry(.65*scale,.75*scale,.12*scale,4),shadow);base.rotation.y=Math.PI/4;base.position.set(x,.08,z);scene.add(base);
 const pyr=new THREE.Mesh(new THREE.ConeGeometry(.72*scale,.95*scale,4),sand);pyr.rotation.y=Math.PI/4;pyr.position.set(x,.57,z);scene.add(pyr);
}
function createSakura(x,z){
 const bark=mat(0x6a4737,.97),leaf=mat(0xf1a5bb,.88),leaf2=mat(0xf4c1d0,.88);
 const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.09,.12,1.45,10),bark);trunk.position.set(x,.72,z);scene.add(trunk);
 const branch=new THREE.Mesh(new THREE.CylinderGeometry(.04,.05,.9,8),bark);branch.position.set(x+.18,1.25,z);branch.rotation.z=-.95;scene.add(branch);
 for(const [dx,dy,dz,s] of [[0,1.75,0,.42],[.34,1.55,.08,.28],[.18,1.45,-.26,.24],[-.2,1.48,.22,.24]]){const bloom=new THREE.Mesh(new THREE.SphereGeometry(s,10,8),dx>=0?leaf:leaf2);bloom.position.set(x+dx,dy,z+dz);bloom.scale.set(1,.8,1);scene.add(bloom)}
}

// Fallback artístico para Sala II, quando alguma imagem ainda não foi escolhida.
function renaissancePlaceholder(i){
 const ex=exhibits[i],c=document.createElement('canvas');c.width=900;c.height=650;
 const g=c.getContext('2d');g.fillStyle=i===11?'#c7b893':'#d6c8aa';g.fillRect(0,0,900,650);
 g.strokeStyle='#6e5643';g.lineWidth=6;
 if(i===11){for(let j=0;j<13;j++){const x=100+j*56;g.beginPath();g.moveTo(x,560);g.quadraticCurveTo(x-30,300-j%4*42,x+12,160+j%3*50);g.stroke();for(let k=0;k<6;k++){g.beginPath();g.ellipse(x+Math.sin(k*3+j)*27,235+k*42,23,6,k*.3,0,Math.PI*2);g.stroke()}}}
 else if(i===9){g.beginPath();g.arc(450,300,230,0,Math.PI*2);g.stroke();g.strokeRect(260,70,380,500);g.beginPath();g.arc(450,180,45,0,Math.PI*2);g.moveTo(450,225);g.lineTo(450,410);g.moveTo(310,260);g.lineTo(590,260);g.moveTo(450,410);g.lineTo(340,545);g.moveTo(450,410);g.lineTo(560,545);g.stroke()}
 else{g.font='70px Georgia';g.textAlign='center';g.fillStyle='#5c4c3d';g.fillText(i===8?'✧':'✦',450,300)}
 g.font='bold 32px Georgia';g.fillStyle='#314436';g.textAlign='center';g.fillText(ex.subtitle,450,610,830);
 ex.fallbackUrl=c.toDataURL('image/png');const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
function sciencePlaceholder(i){
 const ex=exhibits[i],canvas=document.createElement('canvas');canvas.width=920;canvas.height=650;
 const ctx=canvas.getContext('2d');ctx.fillStyle=i===12?'#4a3024':i===13?'#554336':i===14?'#392f2a':'#a5a39a';ctx.fillRect(0,0,920,650);
 const glow=ctx.createRadialGradient(i===15?680:320,265,20,460,340,550);
 glow.addColorStop(0,i===15?'rgba(255,244,196,.95)':'rgba(235,181,112,.86)');glow.addColorStop(1,'rgba(20,18,20,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,920,650);
 ctx.fillStyle='#1e2223';
 if(i===12){for(let k=0;k<3;k++){const x=240+k*220;ctx.beginPath();ctx.arc(x,180,50,0,7);ctx.fill();ctx.fillRect(x-55,225,110,215)}}
 else if(i===13){ctx.fillRect(180,420,540,85);ctx.fillStyle='#c8a786';ctx.fillRect(250,375,385,50);for(let k=0;k<4;k++){ctx.beginPath();ctx.arc(220+k*155,188,40,0,7);ctx.fill();ctx.fillRect(180+k*155,230,75,175)}}
 else if(i===14){ctx.strokeStyle='#e1ce9a';ctx.lineWidth=12;ctx.strokeRect(300,255,330,240);ctx.beginPath();ctx.arc(465,360,95,0,7);ctx.stroke();ctx.fillStyle='#ded6bf';ctx.beginPath();ctx.ellipse(460,365,62,36,0,0,7);ctx.fill();}
 else{ctx.fillStyle='#383b41';ctx.fillRect(0,505,920,145);ctx.fillStyle='#57493d';ctx.fillRect(340,360,360,90);ctx.fillRect(390,325,200,65);ctx.fillStyle='#ded1b4';for(let k=0;k<4;k++){ctx.beginPath();ctx.arc(350+k*85,470,34,0,7);ctx.fill()}}
 ctx.fillStyle='#efe1c2';ctx.font='bold 39px Georgia';ctx.textAlign='center';ctx.fillText(ex.subtitle,460,600,820);
 ex.fallbackUrl=canvas.toDataURL('image/png');const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;return tex;
}


function contemporaryPlaceholder(i){
 const ex=exhibits[i],c=document.createElement('canvas');c.width=920;c.height=650;
 const g=c.getContext('2d');const colors={16:'#917964',17:'#7c7773',18:'#aa8173',19:'#8b9c95'};
 g.fillStyle=colors[i]||'#938676';g.fillRect(0,0,920,650);
 g.fillStyle='rgba(255,246,217,.18)';for(let k=0;k<16;k++)g.fillRect(k*68,0,2,650);
 if(i===16){g.fillStyle='#d8ad86';g.fillRect(390,180,145,280);g.beginPath();g.arc(463,126,68,0,7);g.fill();g.fillStyle='#9b4238';for(let n=0;n<4;n++){g.beginPath();g.ellipse(425+n*25,288,12,67,0,0,7);g.fill()}}
 else if(i===17){g.fillStyle='#c6a28f';g.beginPath();g.ellipse(470,310,200,145,-.2,0,7);g.fill();g.beginPath();g.arc(325,255,69,0,7);g.fill();g.strokeStyle='#785c54';for(let n=0;n<7;n++){g.beginPath();g.moveTo(274,242+n*9);g.lineTo(357,240+n*10);g.stroke()}}
 else if(i===18){g.fillStyle='#dfb39a';g.beginPath();g.ellipse(460,355,185,235,0,0,7);g.fill();g.beginPath();g.arc(458,150,77,0,7);g.fill();g.strokeStyle='#80574d';g.lineWidth=5;g.beginPath();g.moveTo(300,360);g.quadraticCurveTo(460,455,620,350);g.stroke()}
 else{g.fillStyle='#dcc7a8';g.beginPath();g.arc(435,155,68,0,7);g.fill();g.fillStyle='#64918c';g.fillRect(325,225,225,290);g.fillStyle='#494a46';g.fillRect(360,495,60,130);g.fillRect(475,495,60,130);g.strokeStyle='#554d47';g.lineWidth=9;g.strokeRect(625,315,140,175)}
 g.fillStyle='rgba(29,39,34,.9)';g.fillRect(0,555,920,95);g.fillStyle='#f4e7d3';g.textAlign='center';g.font='bold 32px Georgia';g.fillText(ex.subtitle,460,610,850);
 ex.fallbackUrl=c.toDataURL('image/png');const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}

function addRoomPicture(cx,z,exhibitIndex,side){
 const ex=exhibits[exhibitIndex];
 const wallX=cx+(side==='left'?-12.5:12.5);
 const frameX=cx+(side==='left'?-12.30:12.30);
 cube(frameX,2.43,z,.12,3.4,4.55,gold);
 cube(frameX+(side==='left'?.065:-.065),2.43,z,.09,3.14,4.28,dark);
 const fallbackTexture=exhibitIndex>=16?contemporaryPlaceholder(exhibitIndex):exhibitIndex>=12?sciencePlaceholder(exhibitIndex):exhibitIndex>=8?renaissancePlaceholder(exhibitIndex):makeExhibitFallback(exhibitIndex);
 const painting=new THREE.Mesh(new THREE.PlaneGeometry(4.0,2.82),new THREE.MeshBasicMaterial({map:fallbackTexture,side:THREE.DoubleSide}));
 painting.position.set(cx+(side==='left'?-12.19:12.19),2.44,z);
 painting.rotation.y=side==='left'?Math.PI/2:-Math.PI/2;
 scene.add(painting);painting.userData.exhibit=exhibitIndex;paintings.push(painting);
 const image=new THREE.TextureLoader();image.load(ex.image,t=>{
   t.colorSpace=THREE.SRGBColorSpace;
   painting.material.map.dispose();painting.material.map=t;painting.material.needsUpdate=true;
   ex.url=ex.image;
 },undefined,()=>{ex.url=ex.fallbackUrl||null;});
 const shortTitles={4:'PINTURA RUPESTRE',6:'ARTE EGÍPCIA',5:'GRÉCIA · DORÍFORO',7:'PINTURA JAPONESA',8:'ARTE SACRA',9:'HOMEM VITRUVIANO',10:'PIETÀ · MICHELANGELO',11:'DÜRER · BOTÂNICA',12:'CARAVAGGIO · LUZ E SOMBRA',13:'REMBRANDT · ANATOMIA',14:'A BOMBA DE AR',15:'TURNER · LUZ E MOVIMENTO',16:'HIRST · H Y M N',17:'MUECK · ENVELHECIMENTO',18:'SAVILLE · DIVERSIDADE',19:'HANSON · COTIDIANO'};
 const plaque=makeSign(shortTitles[exhibitIndex]||ex.title.toUpperCase(),4.8,.66);
 plaque.position.set(cx+(side==='left'?-12.13:12.13),.42,z);
 plaque.rotation.y=side==='left'?Math.PI/2:-Math.PI/2;
 scene.add(plaque);
 const spot=new THREE.SpotLight(0xffdec0,26,10,Math.PI/5,.5);spot.position.set(cx+(side==='left'?-9:9),4.20,z);spot.target.position.set(wallX,2.3,z);scene.add(spot,spot.target);
 addRoomCarpet(cx,z,side,2.75);
}

// Percurso cronológico em uma única sala: o visitante inicia perto de Z positivo.
// Pré-história → Egito → Grécia → Japão (percurso em sentido horário).
const room1x=museumRooms[0].x;
addRoomPicture(room1x, 5, 4, 'left');   // Pré-história
addRoomPicture(room1x,-5, 6, 'left');   // Egito
addRoomPicture(room1x,-5, 5, 'right');  // Grécia
addRoomPicture(room1x, 5, 7, 'right');  // Japão
addRoomColumns(room1x);
addRoomPlants(room1x);
// Miniaturas junto de cada núcleo, sem ocupar o corredor central.
// Miniaturas entre os quadros de cada parede (sem cobrir as obras).
createMiniPyramid(room1x-9.35,0,1.05);
createMiniParthenon(room1x+9.4,0);
createSakura(room1x+8.5,6.7);

// Caminho central em verde-escuro rumo à porta para a próxima sala.
const corridorGreen=mat(0x155039,.98), corridorTrim=mat(0xbd9a5d,.85);
cube(room1x,.056,-1.1,2.65,.065,20.5,corridorGreen);
for(const dx of [-1.23,1.23]){
 cube(room1x+dx,.093,-1.1,.045,.012,20.3,corridorTrim);
}

// Sala II reproduz os elementos estruturais da sala anterior.
const room2x=museumRooms[1].x;
addRoomPicture(room2x, 5, 8, 'left');
addRoomPicture(room2x,-5, 9, 'left');
addRoomPicture(room2x,-5,10, 'right');
addRoomPicture(room2x, 5,11, 'right');
addRoomColumns(room2x);addRoomPlants(room2x);
cube(room2x,.056,-1.1,2.65,.065,20.5,corridorGreen);
for(const dx of [-1.23,1.23])cube(room2x+dx,.093,-1.1,.045,.012,20.3,corridorTrim);
// Elementos discretos: pedestal de escultura, mesa de estudos e vaso botânico.
const ivory=mat(0xd9c6a5,.9),ink=mat(0x473a30,.9);
cube(room2x+9.1,.38,0,1.4,.76,1.2,ivory);
const book=cube(room2x-8.9,.95,0,1.0,.12,.75,ivory);book.rotation.y=.18;
cube(room2x-8.9,.84,0,1.1,.18,.85,ink);
createPottedPlant(room2x+8.7,7,.9);
// Sala III: quatro obras e circulação equivalente à Sala II.
const room3x=museumRooms[2].x;
addRoomPicture(room3x, 5,12,'left');
addRoomPicture(room3x,-5,13,'left');
addRoomPicture(room3x,-5,14,'right');
addRoomPicture(room3x, 5,15,'right');
addRoomColumns(room3x);addRoomPlants(room3x);
cube(room3x,.056,-1.1,2.65,.065,20.5,corridorGreen);
for(const dx of [-1.23,1.23])cube(room3x+dx,.093,-1.1,.045,.012,20.3,corridorTrim);
// Elementos simbólicos: prisma da luz, bancada anatômica e um globo.
const prism=new THREE.Mesh(new THREE.ConeGeometry(.56,1.05,3),new THREE.MeshStandardMaterial({color:0x7cabb7,roughness:.22,metalness:.16,transparent:true,opacity:.75}));prism.position.set(room3x-9.3,1.08,0);scene.add(prism);
cube(room3x-9.3,.40,0,1.6,.7,1.2,ivory);
const globe=new THREE.Mesh(new THREE.SphereGeometry(.50,20,12),mat(0x668f92,.8));globe.position.set(room3x+9.3,1.35,0);scene.add(globe);
cube(room3x+9.3,.46,0,1.35,.9,1.15,ivory);
// Sala IV: obras, tapetes, colunas, plantas e percurso mantidos.
const room4x=museumRooms[3].x;
addRoomPicture(room4x, 5,16,'left');
addRoomPicture(room4x,-5,17,'left');
addRoomPicture(room4x,-5,18,'right');
addRoomPicture(room4x, 5,19,'right');
addRoomColumns(room4x);addRoomPlants(room4x);
cube(room4x,.056,-1.1,2.65,.065,20.5,corridorGreen);
for(const dx of [-1.23,1.23])cube(room4x+dx,.093,-1.1,.045,.012,20.3,corridorTrim);
// 1. Modelo didático anatômico estilizado ao lado da parede esquerda.
const anatomyBase=room4x-9.35;
cube(anatomyBase,.44,0,1.25,.88,1.05,ivory);
const torso=new THREE.Mesh(new THREE.CylinderGeometry(.33,.41,1.02,14),mat(0xc59c81,.8));torso.position.set(anatomyBase,1.45,0);scene.add(torso);
const head=new THREE.Mesh(new THREE.SphereGeometry(.24,14,10),mat(0xddb69d,.8));head.position.set(anatomyBase,2.15,0);scene.add(head);
for(const dx of [-.17,0,.17]){const muscle=new THREE.Mesh(new THREE.CapsuleGeometry(.064,.53,5,8),mat(0x9b4039,.82));muscle.position.set(anatomyBase+dx,1.40,.34);scene.add(muscle)}
// 2. Espelho simbólico: painel reflexivo com silhueta e pergunta.
const mirrorFrame=mat(0xb49a78,.6),mirrorFace=new THREE.MeshBasicMaterial({color:0x90adb3,transparent:true,opacity:.88,side:THREE.DoubleSide});
cube(room4x+9.1,1.55,0,.22,2.8,2.0,mirrorFrame);
const mirror=new THREE.Mesh(new THREE.PlaneGeometry(1.74,2.48),mirrorFace);mirror.position.set(room4x+8.95,1.60,0);mirror.rotation.y=-Math.PI/2;scene.add(mirror);
const mirrorQuestion=makeSign('COMO A ARTE VERIA VOCÊ?',3.6,.43);mirrorQuestion.position.set(room4x+9.0,3.34,0);mirrorQuestion.rotation.y=-Math.PI/2;scene.add(mirrorQuestion);
// 3. Pessoa comum estilizada em pedestal, sem copiar obra protegida.
cube(room4x+9.3,.36,8.5,1.5,.72,1.0,ivory);
const everyday=mat(0x536b69,.9),skin=mat(0xb58d75,.9),trousers=mat(0x444a53,.94);
function figurePart(geo,m,x,y,z){const v=new THREE.Mesh(geo,m);v.position.set(x,y,z);scene.add(v);return v}
figurePart(new THREE.CylinderGeometry(.24,.27,.75,12),everyday,room4x+9.3,1.49,8.5);
figurePart(new THREE.SphereGeometry(.20,12,10),skin,room4x+9.3,2.13,8.5);
for(const dx of [-.14,.14])figurePart(new THREE.CylinderGeometry(.085,.09,.58,10),trousers,room4x+9.3+dx,.84,8.5);

function travel(destination){
 currentRoom=destination;
 for(const k in keys)keys[k]=false;
 joystick.x=joystick.y=0;verticalSpeed=0;onGround=true;
 if(destination===-1){camera.position.set(0,EYE_HEIGHT,8.6);camera.rotation.set(0,0,0);}
 else{camera.position.set(museumRooms[destination].x,EYE_HEIGHT,9.1);camera.rotation.set(0,0,0);}
 $('room').textContent=destination===-1?'Lobby · Museu Vivo':museumRooms[destination].name;
 const prog=roomWorksCount();$('progress').innerHTML=destination===-1?'Obras do lobby: <b id="count">0/0</b>':`Obras desta sala: <b id="count">${prog.seen}/${prog.total||0}</b>`;
 $('hint').textContent='Explore os quadros e procure a porta verde para continuar.';
}

function showFinale(){
 modal=true;if(!isTouchDevice)controls.unlock();$('start').classList.add('hidden');$('finish').classList.remove('hidden');
}
function finishReturn(){
 $('finish').classList.add('hidden');modal=false;travel(-1);if(!isTouchDevice)controls.lock();
}
$('finish-return').onclick=finishReturn;
$('finish-quiz').onclick=()=>{$('finish').classList.add('hidden');modal=true;qi=0;score=0;drawQuestion();$('quiz').classList.remove('hidden');};

function reachableDoor(){
 raycaster.setFromCamera(center,camera);
 const hit=raycaster.intersectObjects(doors)[0];return hit&&hit.distance<5.8?hit.object.userData.destination:null;
}
// Centro visitável e indicação de encerramento.
cube(0,.45,4.4,3.4,.9,1.2,base);cube(0,.96,4.4,3.1,.12,1.0,dark);
const top=new THREE.Mesh(new THREE.TorusGeometry(.39,.055,12,48),gold);top.rotation.x=Math.PI/2;top.position.set(0,1.35,4.4);scene.add(top);
const raycaster=new THREE.Raycaster(),center=new THREE.Vector2(0,0);const keys={};let active=null,opened=new Set(),modal=false;
// Movimentação: velocidades em m/s; pulo usa gravidade e só começa no chão.
const EYE_HEIGHT = 1.68, WALK_SPEED = 4.35, RUN_SPEED = 8, JUMP_SPEED = 5.8, GRAVITY = 15;
let verticalSpeed = 0;
let onGround = true;
function reachable(){raycaster.setFromCamera(center,camera);const hit=raycaster.intersectObjects(paintings)[0];return hit && hit.distance<6.7 ? hit.object.userData.exhibit : null;}
function roomWorksCount(){const map={0:[4,6,5,7],1:[8,9,10,11],2:[12,13,14,15],3:[16,17,18,19]};const ids=map[currentRoom]||[];return {seen:ids.filter(k=>opened.has(k)).length,total:ids.length};}
function artPlaceholder(label){const c=document.createElement('canvas');c.width=700;c.height=850;const g=c.getContext('2d');g.fillStyle='#b5a083';g.fillRect(0,0,700,850);g.fillStyle='#27352d';g.textAlign='center';g.font='bold 35px Georgia';g.fillText(label.slice(0,29),350,400);g.font='23px Arial';g.fillText('Imagem a ser adicionada pelo grupo',350,460);return c.toDataURL()}
function showLeonardoTabs(ex){
 const host=$('detail-art');const tabs=document.createElement('div');tabs.style.cssText='display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap';
 const image=host.querySelector('img');
 const info=document.createElement('p');info.style.cssText='font-size:12px;line-height:1.5;color:#d6c8a9;margin:8px 0';
 const options=[['O corpo por fora',ex.image,'Proporção, simetria e geometria: c. 1490.'],['O corpo por dentro',ex.anatomyImage,'Ossos, músculos e órgãos: investigações anatômicas posteriores.']];
 options.forEach(([label,url,desc],index)=>{
  const btn=document.createElement('button');btn.type='button';btn.textContent=label;btn.className='secondary';btn.style.cssText='margin:0;padding:9px 10px;border:1px solid #b08a52;border-radius:5px';
  btn.onclick=()=>{image.src=url;image.onerror=()=>{image.onerror=null;image.src=ex.fallbackUrl||artPlaceholder('ESTUDOS ANATÔMICOS');};info.textContent=desc;Array.from(tabs.children).forEach(el=>el.style.background='transparent');btn.style.background='#1a553e'};
  tabs.appendChild(btn);if(index===0)btn.style.background='#1a553e';
 });
 info.textContent=options[0][2];host.insertBefore(tabs,image);host.appendChild(info);
}
function showLightMiniGame(){
 const host=$('detail-art');const wrapper=document.createElement('div');wrapper.style.cssText='border:1px solid #b08a52;border-radius:8px;padding:12px;margin-top:12px;background:#13191d';
 const heading=document.createElement('strong');heading.textContent='MINIGAME · EXPERIMENTE A ILUMINAÇÃO';heading.style.cssText='font-size:12px;color:#d7ae76';wrapper.appendChild(heading);
 const text=document.createElement('p');text.style.cssText='font-size:12px;line-height:1.5;color:#d3d7d6';text.textContent='Mude a intensidade da fonte luminosa e observe como o contraste transforma a leitura do rosto.';wrapper.appendChild(text);
 const canvas=document.createElement('canvas');canvas.width=480;canvas.height=260;canvas.style.cssText='width:100%;height:auto;border-radius:6px;background:#171a20';wrapper.appendChild(canvas);
 const bar=document.createElement('input');bar.type='range';bar.min='5';bar.max='100';bar.value='55';bar.step='5';bar.style.cssText='width:100%;margin-top:12px;accent-color:#d7ae76';bar.setAttribute('aria-label','Intensidade da luz');wrapper.appendChild(bar);
 const status=document.createElement('p');status.style.cssText='font-size:12px;color:#d7ae76';wrapper.appendChild(status);
 function paint(){const ctx=canvas.getContext('2d'),light=Number(bar.value);ctx.clearRect(0,0,480,260);ctx.fillStyle='#171a20';ctx.fillRect(0,0,480,260);
 const glow=ctx.createRadialGradient(115,65,8,190,120,270);glow.addColorStop(0,`rgba(255,224,160,${light/120})`);glow.addColorStop(1,'rgba(255,224,160,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,480,260);
 ctx.fillStyle='#39323b';ctx.beginPath();ctx.ellipse(255,277,108,103,0,0,Math.PI*2);ctx.fill();
 const face=ctx.createLinearGradient(195,0,321,0);face.addColorStop(0,`rgb(${110+Math.round(light*1.2)},${72+Math.round(light*.9)},${50+Math.round(light*.65)})`);face.addColorStop(.52,`rgb(${90+Math.round(light*.85)},${63+Math.round(light*.6)},${47+Math.round(light*.43)})`);face.addColorStop(1,'#211b1b');ctx.fillStyle=face;ctx.beginPath();ctx.ellipse(255,133,74,94,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#2d2521';ctx.beginPath();ctx.ellipse(255,63,75,37,0,Math.PI,Math.PI*2);ctx.fill();ctx.strokeStyle=`rgba(32,26,26,${.12+light/175})`;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(213,126);ctx.lineTo(230,126);ctx.moveTo(274,126);ctx.lineTo(293,126);ctx.moveTo(255,133);ctx.lineTo(247,170);ctx.lineTo(261,170);ctx.moveTo(228,193);ctx.quadraticCurveTo(256,205,284,193);ctx.stroke();
 status.textContent=`Intensidade: ${light}% · ${light<35?'predominam as sombras':light>75?'maior iluminação e menor contraste local':'luz e sombra equilibradas'}`;}
 bar.addEventListener('input',paint);paint();host.appendChild(wrapper);
}
function showDetail(i){active=i;opened.add(i);const prog=roomWorksCount();$('count').textContent=`${prog.seen}/${prog.total||4}`;const ex=exhibits[i];$('detail-era').textContent=ex.era;$('detail-title').textContent=ex.title;$('detail-desc').textContent=ex.desc;$('detail-bio').textContent=ex.bio;$('detail-question').textContent='PARA PENSAR · '+ex.question;$('detail-art').innerHTML='';const img=new Image();img.src=ex.url||artPlaceholder(ex.title);img.alt='Imagem da obra: '+ex.title;$('detail-art').appendChild(img);img.onerror=()=>{img.onerror=null;img.src=ex.fallbackUrl||artPlaceholder(ex.title)};if(i===9)showLeonardoTabs(ex);if(i===12)showLightMiniGame();modal=true;if(!isTouchDevice)controls.unlock();$('start').classList.add('hidden');$('detail').classList.remove('hidden');}
function resume(){modal=false;$('detail').classList.add('hidden');$('quiz').classList.add('hidden');if(!isTouchDevice)controls.lock();}
$('play').addEventListener('click',()=>{if(isTouchDevice){mobilePlaying=true;$('start').classList.add('hidden')}else controls.lock()});controls.addEventListener('lock',()=>{$('start').classList.add('hidden')});controls.addEventListener('unlock',()=>{if(!modal)$('start').classList.remove('hidden')});$('close-detail').onclick=resume;$('continue').onclick=resume;
window.addEventListener('keydown',e=>{if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();keys[e.code]=true;if(e.code==='Space'&&controls.isLocked&&onGround&&!e.repeat){verticalSpeed=JUMP_SPEED;onGround=false}if(e.code==='KeyE'&&controls.isLocked){const door=reachableDoor();if(door!==null){if(currentRoom===3&&door===-1)showFinale();else travel(door);}else{const i=reachable();if(i!==null)showDetail(i)}}});window.addEventListener('keyup',e=>keys[e.code]=false);window.addEventListener('blur',()=>{for(const k in keys)keys[k]=false});renderer.domElement.addEventListener('click',()=>{if(isTouchDevice)return;if(!controls.isLocked){if(!modal)controls.lock();return}const door=reachableDoor();if(door!==null){if(currentRoom===3&&door===-1)showFinale();else travel(door);}else{const i=reachable();if(i!==null)showDetail(i)}});
const questions=[{q:'Na arte grega clássica, as figuras humanas frequentemente buscavam...',a:['Retratar sempre pessoas comuns, sem idealização','Representar proporções e ideais de harmonia','Mostrar órgãos internos com precisão médica'],correct:1,why:'Muitas obras clássicas valorizavam equilíbrio, proporções e beleza idealizada.'},{q:'Por que os estudos anatômicos interessavam a artistas do Renascimento?',a:['Para compreender melhor estruturas e movimentos do corpo','Porque a arte deixou de ter significados simbólicos','Para substituir completamente a observação artística'],correct:0,why:'A observação da anatomia podia aprimorar a representação de músculos, articulações e movimentos.'},{q:'Uma obra hiper-realista é necessariamente superior a uma abstrata?',a:['Sim, porque contém mais detalhes','Sim, porque exige mais materiais','Não: cada obra pode ter objetivos expressivos diferentes'],correct:2,why:'Precisão visual não é a única medida de valor artístico; há diferentes linguagens e propósitos.'}];let qi=0,score=0,choice=null,answered=false;
function drawQuestion(){const q=questions[qi];$('quiz-body').innerHTML=`<div class="eyebrow">QUESTÃO ${qi+1} DE ${questions.length}</div><p>${q.q}</p>`;q.a.forEach((answer,i)=>{const b=document.createElement('button');b.className='answer';b.textContent=`${'ABC'[i]}. ${answer}`;b.onclick=()=>{if(answered)return;choice=i;document.querySelectorAll('.answer').forEach(el=>el.classList.remove('selected'));b.classList.add('selected');$('quiz-next').disabled=false};$('quiz-body').appendChild(b)});$('quiz-result').textContent='';$('quiz-next').textContent='CONFIRMAR RESPOSTA';$('quiz-next').disabled=true;choice=null;answered=false;}
$('quiz-open').onclick=()=>{modal=true;if(!isTouchDevice)controls.unlock();$('start').classList.add('hidden');qi=0;score=0;drawQuestion();$('quiz').classList.remove('hidden')};$('quiz-close').onclick=resume;
$('quiz-next').onclick=()=>{if(!answered){if(choice===null)return;answered=true;const good=choice===questions[qi].correct;if(good)score++;document.querySelectorAll('.answer').forEach((el,i)=>{el.disabled=true;if(i===questions[qi].correct)el.classList.add('correct');else if(i===choice)el.classList.add('wrong')});$('quiz-result').textContent=(good?'✓ Você acertou! ':'Essa não era a resposta. ')+questions[qi].why;$('quiz-next').textContent=qi===questions.length-1?'VER RESULTADO':'PRÓXIMA QUESTÃO'}else if(qi<questions.length-1){qi++;drawQuestion()}else{$('quiz-body').innerHTML=`<h3>Você acertou ${score} de ${questions.length} perguntas!</h3><p>A arte e a Biologia se influenciam, mas o realismo não é a única forma de representar o ser humano.</p>`;$('quiz-result').textContent='Obrigado por visitar o Museu Vivo.';$('quiz-next').textContent='RECOMEÇAR';$('quiz-next').onclick=()=>{qi=0;score=0;drawQuestion();$('quiz-next').onclick=quizNext};}};
const quizNext=$('quiz-next').onclick;
// Controles mobile: dois dedos independentes para caminhar e olhar.
if(isTouchDevice){
 const stick=$('mobile-stick'),knob=$('mobile-knob');let stickId=null;
 function updateStick(e){const r=stick.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=e.clientX-cx,dy=e.clientY-cy,limit=r.width*.36,mag=Math.hypot(dx,dy),factor=mag>limit?limit/mag:1;joystick.x=dx*factor/limit;joystick.y=dy*factor/limit;knob.style.transform=`translate(${joystick.x*limit}px,${joystick.y*limit}px)`;}
 stick.addEventListener('pointerdown',e=>{if(stickId!==null)return;stickId=e.pointerId;stick.setPointerCapture(e.pointerId);updateStick(e);e.preventDefault()});
 stick.addEventListener('pointermove',e=>{if(e.pointerId===stickId)updateStick(e)});
 const stopStick=e=>{if(e.pointerId!==stickId)return;stickId=null;joystick.x=joystick.y=0;knob.style.transform='translate(0,0)'};
 stick.addEventListener('pointerup',stopStick);stick.addEventListener('pointercancel',stopStick);
 const canvas=renderer.domElement;let lookId=null,lastX=0,lastY=0;
 canvas.addEventListener('pointerdown',e=>{if(!mobilePlaying||modal||lookId!==null)return;lookId=e.pointerId;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId);e.preventDefault()});
 canvas.addEventListener('pointermove',e=>{if(lookId!==e.pointerId||modal)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;camera.rotation.order='YXZ';camera.rotation.y-=dx*.004;camera.rotation.x=THREE.MathUtils.clamp(camera.rotation.x-dy*.004,-Math.PI/2+.08,Math.PI/2-.08)});
 const stopLook=e=>{if(lookId===e.pointerId)lookId=null};canvas.addEventListener('pointerup',stopLook);canvas.addEventListener('pointercancel',stopLook);
 function interactMobile(){if(!mobilePlaying||modal)return;const door=reachableDoor();if(door!==null){if(currentRoom===3&&door===-1)showFinale();else travel(door)}else{const i=reachable();if(i!==null)showDetail(i)}}
 $('mobile-use').addEventListener('click',interactMobile);
 $('mobile-jump').addEventListener('click',()=>{if(mobilePlaying&&!modal&&onGround){verticalSpeed=JUMP_SPEED;onGround=false}});
 const run=$('mobile-run');run.addEventListener('pointerdown',e=>{mobileRunning=true;run.classList.add('pressed');run.setPointerCapture(e.pointerId);e.preventDefault()});
 for(const ev of ['pointerup','pointercancel','lostpointercapture'])run.addEventListener(ev,()=>{mobileRunning=false;run.classList.remove('pressed')});
 $('mobile-pause').addEventListener('click',()=>{if(!mobilePlaying)return;mobilePlaying=false;$('start').classList.remove('hidden')});
 window.addEventListener('blur',()=>{joystick.x=joystick.y=0;mobileRunning=false});
}
const clock=new THREE.Clock();
function loop(){
 requestAnimationFrame(loop);
 const dt=Math.min(clock.getDelta(),.05);
 if(controls.isLocked || (isTouchDevice && mobilePlaying && !modal)){
  const moving=keys.KeyW||keys.ArrowUp||keys.KeyS||keys.ArrowDown||keys.KeyA||keys.ArrowLeft||keys.KeyD||keys.ArrowRight;
  const running=keys.ShiftLeft||keys.ShiftRight||mobileRunning;
  const speed=(running?RUN_SPEED:WALK_SPEED)*dt;
  const oldX=camera.position.x, oldZ=camera.position.z;
  if(keys.KeyW||keys.ArrowUp)controls.moveForward(speed);
  if(isTouchDevice && joystick.y!==0)controls.moveForward(-joystick.y*speed);
  if(keys.KeyS||keys.ArrowDown)controls.moveForward(-speed);
  if(keys.KeyA||keys.ArrowLeft)controls.moveRight(-speed);
  if(isTouchDevice && joystick.x!==0)controls.moveRight(joystick.x*speed);
  if(keys.KeyD||keys.ArrowRight)controls.moveRight(speed);
  const roomCenter=currentRoom===-1?0:museumRooms[currentRoom].x;
  camera.position.x=THREE.MathUtils.clamp(camera.position.x,roomCenter-11.7,roomCenter+11.7);
  camera.position.z=THREE.MathUtils.clamp(camera.position.z,-12,12);
  const inX=currentRoom===-1&&Math.abs(camera.position.x)<2.3,inZ=Math.abs(camera.position.z-4.4)<1.25;
  if(inX&&inZ){camera.position.x=oldX;camera.position.z=oldZ;}
  if(!onGround){
   verticalSpeed-=GRAVITY*dt;
   camera.position.y+=verticalSpeed*dt;
   if(camera.position.y<=EYE_HEIGHT){camera.position.y=EYE_HEIGHT;verticalSpeed=0;onGround=true;}
  }else{camera.position.y=EYE_HEIGHT;}
  const i=reachable(),door=reachableDoor();
  $('hint').textContent=door!==null?'Pressione E ou clique para atravessar a porta':i===null?(moving&&running?'Correndo · Shift para correr · Espaço para pular':'WASD andar · Shift correr · Espaço pular · Mouse olhar'):'Pressione E ou clique para examinar: '+exhibits[i].title;
  $('room').textContent=currentRoom!==-1?museumRooms[currentRoom].name:(i===null?'Lobby · Museu Vivo':exhibits[i].era);
 }
 renderer.render(scene,camera);
}
loop();
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
