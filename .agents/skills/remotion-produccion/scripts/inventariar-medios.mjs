import fs from 'node:fs/promises';
import path from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const run=promisify(execFile);
const args=process.argv.slice(2);
const outIndex=args.indexOf('--out');
const allowed=new Set(['--out','--overwrite']);
if(!args[0]||outIndex<1||!args[outIndex+1]||args.some(x=>x.startsWith('--')&&!allowed.has(x))){
 console.error('Uso: node inventariar-medios.mjs <carpeta> --out <inventario.json> [--overwrite]');process.exit(2);
}
const input=path.resolve(args[0]);const output=path.resolve(args[outIndex+1]);
const images=new Set(['.png','.jpg','.jpeg','.webp','.gif','.avif','.apng','.bmp','.tif','.tiff']);
const audio=new Set(['.mp3','.wav','.flac','.m4a','.aac','.ogg','.opus','.aiff','.aif']);
const video=new Set(['.mp4','.mov','.mkv','.webm','.avi','.m4v','.mts']);
const supported=new Set([...images,...audio,...video]);
const files=[];const ignored=[];
async function walk(dir){for(const e of await fs.readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isSymbolicLink())continue;if(e.isDirectory()){if(!['node_modules','.git','.agents'].includes(e.name))await walk(p);}else if(e.isFile()){if(supported.has(path.extname(e.name).toLowerCase()))files.push(p);else ignored.push(path.relative(input,p).replaceAll('\\','/'));}}}
try{
 if(!(await fs.stat(input)).isDirectory())throw Error('La entrada debe ser una carpeta.');
 if(path.extname(output).toLowerCase()!=='.json')throw Error('La salida debe terminar en .json.');
 await run('ffprobe',['-version'],{windowsHide:true,timeout:15000});
 await walk(input);files.sort((a,b)=>a.localeCompare(b,'es',{numeric:true}));
 const result=new Array(files.length);let next=0;
 async function worker(){while(next<files.length){const i=next++;const file=files[i];const ext=path.extname(file).toLowerCase();const item={id:`MEDIA-${String(i+1).padStart(4,'0')}`,path:path.relative(input,file).replaceAll('\\','/'),type:images.has(ext)?'imagen':audio.has(ext)?'audio':'video',extension:ext,bytes:(await fs.stat(file)).size};
  try{const {stdout}=await run('ffprobe',['-v','error','-show_entries','format=duration:stream=codec_type,codec_name,width,height,sample_rate,channels,avg_frame_rate:stream_disposition=attached_pic','-of','json',file],{windowsHide:true,timeout:45000,maxBuffer:1024*1024});const metadata=JSON.parse(stdout);const a=metadata.streams?.find(x=>x.codec_type==='audio');const v=metadata.streams?.find(x=>x.codec_type==='video'&&!x.disposition?.attached_pic);const rate=v?.avg_frame_rate?.split('/').map(Number);item.duration_seconds=Number(metadata.format?.duration)||null;item.has_audio=!!a;item.has_video_track=!!v;item.width=v?.width??null;item.height=v?.height??null;item.fps=images.has(ext)?null:rate?.[1]?rate[0]/rate[1]:null;item.sample_rate_hz=Number(a?.sample_rate)||null;item.channels=a?.channels??null;item.audio_codec=a?.codec_name??null;item.video_codec=v?.codec_name??null;item.status='ok';
  }catch(e){item.status='error';item.error=String(e.stderr||e.message).trim().slice(0,1000);}
  result[i]=item;
 }}
 await Promise.all(Array.from({length:4},worker));
 const errors=result.filter(x=>x.status==='error').length;
 const report={root:input,generated_at:new Date().toISOString(),resource_count:result.length,probe_errors:errors,note:'Metadatos técnicos; no describe escenas ni transcribe audio. SVG y otros archivos no compatibles se enumeran aparte.',resources:result,unprobed_files:ignored};
 await fs.mkdir(path.dirname(output),{recursive:true});
 await fs.writeFile(output,JSON.stringify(report,null,2)+'\n',{encoding:'utf8',flag:args.includes('--overwrite')?'w':'wx'});
 console.log(JSON.stringify({output,resources:result.length,probe_errors:errors,unprobed_files:ignored.length}));
 if(errors)process.exitCode=1;
}catch(e){console.error(e.code==='EEXIST'?'La salida ya existe. Usa otro nombre o --overwrite si quieres sustituirla.':e.message);process.exitCode=1;}
