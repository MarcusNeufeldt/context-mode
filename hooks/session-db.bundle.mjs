import{createRequire as ie}from"node:module";import{existsSync as ae,unlinkSync as P,renameSync as ce}from"node:fs";import{tmpdir as ue}from"node:os";import{join as de}from"node:path";var I=class{#e;constructor(e){this.#e=e}pragma(e){let n=this.#e.prepare(`PRAGMA ${e}`).all();if(!n||n.length===0)return;if(n.length>1)return n;let s=Object.values(n[0]);return s.length===1?s[0]:n[0]}exec(e){let t="",n=null;for(let i=0;i<e.length;i++){let a=e[i];if(n)t+=a,a===n&&(n=null);else if(a==="'"||a==='"')t+=a,n=a;else if(a===";"){let c=t.trim();c&&this.#e.prepare(c).run(),t=""}else t+=a}let s=t.trim();return s&&this.#e.prepare(s).run(),this}prepare(e){let t=this.#e.prepare(e);return{run:(...n)=>t.run(...n),get:(...n)=>{let s=t.get(...n);return s===null?void 0:s},all:(...n)=>t.all(...n),iterate:(...n)=>t.iterate(...n)}}transaction(e){return this.#e.transaction(e)}close(){this.#e.close()}},x=class{#e;constructor(e){this.#e=e}pragma(e){let n=this.#e.prepare(`PRAGMA ${e}`).all();if(!n||n.length===0)return;if(n.length>1)return n;let s=Object.values(n[0]);return s.length===1?s[0]:n[0]}exec(e){return this.#e.exec(e),this}prepare(e){let t=this.#e.prepare(e);return{run:(...n)=>t.run(...n),get:(...n)=>t.get(...n),all:(...n)=>t.all(...n),iterate:(...n)=>typeof t.iterate=="function"?t.iterate(...n):t.all(...n)[Symbol.iterator]()}}transaction(e){return(...t)=>{this.#e.exec("BEGIN");try{let n=e(...t);return this.#e.exec("COMMIT"),n}catch(n){throw this.#e.exec("ROLLBACK"),n}}}close(){this.#e.close()}},m=null;function le(r){let e=null;try{return e=new r(":memory:"),e.exec("CREATE VIRTUAL TABLE __fts5_probe USING fts5(x)"),!0}catch{return!1}finally{try{e?.close()}catch{}}}function ge(r,e){let t=e!==void 0?e:globalThis.Bun;if(typeof t<"u"&&t!==null)return!0;let n=r??process.versions,[s,i]=(n.node??"0.0.0").split("."),a=Number(s),c=Number(i);return!Number.isFinite(a)||!Number.isFinite(c)?!1:a>22||a===22&&c>=5}function Ee(){if(!m){let r=ie(import.meta.url);if(globalThis.Bun){let e=r(["bun","sqlite"].join(":")).Database;m=function(n,s){let i=new e(n,{readonly:s?.readonly,create:!0}),a=new I(i);return s?.timeout&&a.pragma(`busy_timeout = ${s.timeout}`),a}}else if(ge()){let e=null;try{({DatabaseSync:e}=r(["node","sqlite"].join(":")))}catch{e=null}e&&le(e)?m=function(n,s){let i=new e(n,{readOnly:s?.readonly??!1}),a=new x(i);return s?.timeout&&a.pragma(`busy_timeout = ${s.timeout}`),a}:m=r("better-sqlite3")}else m=r("better-sqlite3")}return m}function me(r){r.pragma("journal_mode = WAL"),r.pragma("synchronous = NORMAL");let e=Number(process.env.CONTEXT_MODE_MMAP_SIZE??"0");if(Number.isFinite(e)&&e>0)try{r.pragma(`mmap_size = ${e}`)}catch{}}function k(r){if(!ae(r))for(let e of["-wal","-shm"])try{P(r+e)}catch{}}function _e(r){for(let e of["","-wal","-shm"])try{P(r+e)}catch{}}function L(r){try{r.close()}catch{}}function B(r="context-mode"){return de(ue(),`${r}-${process.pid}.db`)}var pe=["SQLITE_BUSY","database is locked","SQLITE_IOERR","disk I/O error"];function S(r,e=[100,500,2e3]){let t;for(let i=0;i<=e.length;i++)try{return r()}catch(a){let c=a instanceof Error?a.message:String(a);if(!pe.some(d=>c.includes(d)))throw a;t=a instanceof Error?a:new Error(c),i<e.length&&Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,e[i])}let n=t?.message??"",s=n.includes("SQLITE_IOERR")||n.includes("disk I/O error")?"SQLITE_IOERR: disk I/O error":"SQLITE_BUSY: database is locked";throw new Error(`${s} after ${e.length} retries. Original error: ${t?.message}`)}function ye(r){return r.includes("SQLITE_CORRUPT")||r.includes("SQLITE_NOTADB")||r.includes("database disk image is malformed")||r.includes("file is not a database")}function Se(r){let e=Date.now();for(let t of["","-wal","-shm"])try{ce(r+t,`${r}${t}.corrupt-${e}`)}catch{}}var f=Symbol.for("__context_mode_live_dbs_v3__"),b=(()=>{let r=globalThis;return r[f]||(r[f]=new Set,process.on("exit",()=>{for(let e of r[f])L(e);r[f].clear()})),r[f]})(),D=class{#e;#t;constructor(e){let t=Ee();this.#e=e,k(e);let n,s=()=>{let i=new t(e,{timeout:8e3});try{me(i)}catch(a){try{i.close()}catch{}throw a}return i};try{n=S(s)}catch(i){let a=i instanceof Error?i.message:String(i);if(ye(a)){Se(e),k(e);try{n=S(s)}catch(c){throw new Error(`Failed to create fresh DB after renaming corrupt file: ${c instanceof Error?c.message:String(c)}`)}}else throw i}this.#t=n,b.add(this.#t);try{S(()=>this.initSchema()),S(()=>this.prepareStatements())}catch(i){throw b.delete(this.#t),L(this.#t),i}}get db(){return this.#t}get dbPath(){return this.#e}close(){b.delete(this.#t),L(this.#t)}withRetry(e){return S(e)}cleanup(){b.delete(this.#t),L(this.#t),_e(this.#e)}};import{createHash as T}from"node:crypto";import{execFileSync as fe}from"node:child_process";import{accessSync as Te,constants as he,existsSync as O,mkdirSync as ve,realpathSync as Re,renameSync as U}from"node:fs";import{homedir as q}from"node:os";import{dirname as be,isAbsolute as G,join as g,resolve as p}from"node:path";var l="CONTEXT_MODE_DIR",Y="sessions",j="content",h=class extends Error{kind;path;overrideEnvVar;ignoredEnvVar;ignoredReason;constructor(e,t,n=l,s,i,a={}){super(i??Oe(e,t,a),{cause:s}),this.name="StorageDirectoryError",this.kind=e,this.path=t,this.overrideEnvVar=n,this.ignoredEnvVar=a.ignoredEnvVar,this.ignoredReason=a.ignoredReason}},C=new Map;function Ye(r){let e=r.env??process.env,t=r.legacySessionDirEnv,n=t?e[t]?.trim():void 0;return n&&t?(r.onLegacySessionDir?.(t,n),n):g(Le(r.configDir,r.configDirEnv,e),"context-mode","sessions")}function Le(r,e,t){let n=e?t[e]:void 0;return n&&n.trim()!==""?V(n.trim()):V(r,q())}function V(r,e){return r.startsWith("~")?p(q(),r.replace(/^~[/\\]?/,"")):G(r)?p(r):e?p(e,r):p(r)}function De(r,e,t){return new h(r,e,l,void 0,[`Invalid ${l} for context-mode ${r} directory: ${t}`,J()].join(`
`))}function K(r){let e=process.env[l];if(e===void 0)return{kind:"unset"};let t=e.trim();if(!t)return{kind:"ignored-empty",ignoredEnvVar:l,ignoredReason:"empty"};if(!G(t))throw De(r,t,`${l} must be an absolute path.`);return{kind:"override",root:p(t)}}function Ne(r){return r.kind==="ignored-empty"?{ignoredEnvVar:r.ignoredEnvVar,ignoredReason:r.ignoredReason}:{}}function z(r,e){let t=K(r);return t.kind!=="override"?null:{kind:r,path:g(t.root,e),envVar:l,source:"override"}}function Ce(r,e,t){return{kind:r,path:p(e()),envVar:null,source:"default",...t}}function Q(r){let e=K("session");return e.kind==="override"?{kind:"session",path:g(e.root,Y),envVar:l,source:"override"}:Ce("session",r,Ne(e))}function Ke(r){let e=z("content",j);if(e)return e;let t=Q(r);return{kind:"content",path:g(be(t.path),j),envVar:t.envVar,source:t.source,ignoredEnvVar:t.ignoredEnvVar,ignoredReason:t.ignoredReason}}function ze(r){let e=z("stats",Y);if(e)return e;let t=Q(r);return{kind:"stats",path:t.path,envVar:t.envVar,source:t.source,ignoredEnvVar:t.ignoredEnvVar,ignoredReason:t.ignoredReason}}function Qe(r){return r.message}function Je(r){return r.source==="override"&&r.envVar?`via ${r.envVar}`:r.ignoredEnvVar&&r.ignoredReason==="empty"?`default; ignored empty ${r.ignoredEnvVar}`:"default"}function Ze(){C.clear()}function et(r){let e=[r.kind,r.path,r.source,r.envVar??"",r.ignoredEnvVar??"",r.ignoredReason??""].join("\0"),t=C.get(e);if(t instanceof h)throw t;if(t===r.path)return t;try{return ve(r.path,{recursive:!0}),Te(r.path,he.W_OK),C.set(e,r.path),r.path}catch(n){let s=new h(r.kind,we(n)??r.path,l,n,void 0,{ignoredEnvVar:r.ignoredEnvVar,ignoredReason:r.ignoredReason});throw C.set(e,s),s}}function Oe(r,e,t={}){return[`context-mode ${r} directory is not writable: ${e}`,Ae(t),J()].filter(Boolean).join(`
`)}function Ae(r){return r.ignoredEnvVar&&r.ignoredReason==="empty"?`Ignored empty ${r.ignoredEnvVar}; using adapter default.`:null}function J(){return`Set ${l} to a writable absolute path.`}function we(r){if(!r||typeof r!="object")return null;let e=r.path;return typeof e=="string"&&e.length>0?e:null}var _;function E(r){let e=r.replace(/\\/g,"/");return/^\/+$/.test(e)?"/":/^[A-Za-z]:\/+$/.test(e)?`${e.slice(0,2)}/`:e.replace(/\/+$/,"")}function H(r){let e=r;try{e=Re.native(r)}catch{}let t=E(e);return process.platform==="win32"||process.platform==="darwin"?t.toLowerCase():t}function Z(r,e){return fe("git",["-C",r,...e],{encoding:"utf-8",timeout:2e3,stdio:["ignore","pipe","ignore"]}).trim()}function Ie(r){let e=Z(r,["rev-parse","--show-toplevel"]);return e.length>0?E(e):null}function xe(r){let e=Z(r,["worktree","list","--porcelain"]).split(/\r?\n/).find(t=>t.startsWith("worktree "))?.replace("worktree ","")?.trim();return e?E(e):null}function Ue(r=process.cwd()){let e=process.env.CONTEXT_MODE_SESSION_SUFFIX;if(_&&_.projectDir===r&&_.envSuffix===e)return _.suffix;let t="";if(e!==void 0)t=e?`__${e}`:"";else try{let n=Ie(r),s=xe(r);if(n&&s){let i=H(n),a=H(s);i!==a&&(t=`__${T("sha256").update(i).digest("hex").slice(0,8)}`)}}catch{}return _={projectDir:r,envSuffix:e,suffix:t},t}function tt(){_=void 0}function ee(r){return T("sha256").update(E(r)).digest("hex").slice(0,16)}function te(r){let e=E(r),t=process.platform==="darwin"||process.platform==="win32"?e.toLowerCase():e;return T("sha256").update(t).digest("hex").slice(0,16)}function rt(r){let{projectDir:e,contentDir:t}=r,n=te(e),s=g(t,`${n}.db`);if(O(s))return s;let i=ee(e);if(i===n)return s;let a=g(t,`${i}.db`);if(O(a))try{U(a,s);for(let c of["-wal","-shm"])try{U(a+c,s+c)}catch{}}catch{}return s}function nt(r){return Me({...r,ext:".db"})}function Me(r){let{projectDir:e,sessionsDir:t,ext:n}=r,s=r.suffix??Ue(e),i=te(e),a=g(t,`${i}${s}${n}`);if(O(a))return a;let c=ee(e);if(c===i)return a;let d=g(t,`${c}${s}${n}`);if(O(d))try{U(d,a)}catch{}return a}var W=1e3,X=5;function N(r){let e=Number(r);return!Number.isFinite(e)||e<=0?0:Math.floor(e)}var o={insertEvent:"insertEvent",getEvents:"getEvents",getEventsByType:"getEventsByType",getEventsByPriority:"getEventsByPriority",getEventsByTypeAndPriority:"getEventsByTypeAndPriority",getEventCount:"getEventCount",getLatestAttributedProject:"getLatestAttributedProject",checkDuplicate:"checkDuplicate",evictLowestPriority:"evictLowestPriority",updateMetaLastEvent:"updateMetaLastEvent",ensureSession:"ensureSession",getSessionStats:"getSessionStats",getSessionRollup:"getSessionRollup",getMaxFileEdits:"getMaxFileEdits",getLatestCommitMessage:"getLatestCommitMessage",incrementCompactCount:"incrementCompactCount",getUsageCursor:"getUsageCursor",setUsageCursor:"setUsageCursor",upsertResume:"upsertResume",getResume:"getResume",markResumeConsumed:"markResumeConsumed",claimLatestUnconsumedResume:"claimLatestUnconsumedResume",deleteEvents:"deleteEvents",deleteMeta:"deleteMeta",deleteResume:"deleteResume",getOldSessions:"getOldSessions",searchEvents:"searchEvents",incrementToolCall:"incrementToolCall",getToolCallTotals:"getToolCallTotals",getToolCallByTool:"getToolCallByTool",getEventBytesSummary:"getEventBytesSummary"},Fe=[["project_dir","TEXT NOT NULL DEFAULT ''"],["attribution_source","TEXT NOT NULL DEFAULT 'unknown'"],["attribution_confidence","REAL NOT NULL DEFAULT 0"],["bytes_avoided","INTEGER NOT NULL DEFAULT 0"],["bytes_returned","INTEGER NOT NULL DEFAULT 0"]];function re(r){let e=r.pragma("table_xinfo(session_events)"),t=new Set(e.map(s=>s.name)),n=!1;for(let[s,i]of Fe)t.has(s)||(r.exec(`ALTER TABLE session_events ADD COLUMN ${s} ${i}`),n=!0);return n&&r.exec("CREATE INDEX IF NOT EXISTS idx_session_events_project ON session_events(session_id, project_dir)"),n}function st(r,e){let t=null;try{t=new e(r),re(t)}catch{}finally{try{t?.close()}catch{}}}var $=class extends D{constructor(e){super(e?.dbPath??B("session"))}stmt(e){return this.stmts.get(e)}initSchema(){try{let t=this.db.pragma("table_xinfo(session_events)").find(n=>n.name==="data_hash");t&&t.hidden!==0&&this.db.exec("DROP TABLE session_events")}catch{}this.db.exec(`
      CREATE TABLE IF NOT EXISTS session_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        priority INTEGER NOT NULL DEFAULT 2,
        data TEXT NOT NULL,
        project_dir TEXT NOT NULL DEFAULT '',
        attribution_source TEXT NOT NULL DEFAULT 'unknown',
        attribution_confidence REAL NOT NULL DEFAULT 0,
        bytes_avoided INTEGER NOT NULL DEFAULT 0,
        bytes_returned INTEGER NOT NULL DEFAULT 0,
        source_hook TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        data_hash TEXT NOT NULL DEFAULT ''
      );

      CREATE INDEX IF NOT EXISTS idx_session_events_session ON session_events(session_id);
      CREATE INDEX IF NOT EXISTS idx_session_events_type ON session_events(session_id, type);
      CREATE INDEX IF NOT EXISTS idx_session_events_priority ON session_events(session_id, priority);

      CREATE TABLE IF NOT EXISTS session_meta (
        session_id TEXT PRIMARY KEY,
        project_dir TEXT NOT NULL,
        started_at TEXT NOT NULL DEFAULT (datetime('now')),
        last_event_at TEXT,
        event_count INTEGER NOT NULL DEFAULT 0,
        compact_count INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS session_resume (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL UNIQUE,
        snapshot TEXT NOT NULL,
        event_count INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        consumed INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS tool_calls (
        session_id TEXT NOT NULL,
        tool TEXT NOT NULL,
        calls INTEGER NOT NULL DEFAULT 0,
        bytes_returned INTEGER NOT NULL DEFAULT 0,
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        PRIMARY KEY (session_id, tool)
      );

      CREATE INDEX IF NOT EXISTS idx_tool_calls_session ON tool_calls(session_id);
    `);try{re(this.db)}catch{}try{this.db.pragma("table_xinfo(session_meta)").some(t=>t.name==="usage_cursor")||this.db.exec("ALTER TABLE session_meta ADD COLUMN usage_cursor TEXT")}catch{}}prepareStatements(){this.stmts=new Map;let e=(t,n)=>{this.stmts.set(t,this.db.prepare(n))};e(o.insertEvent,`INSERT INTO session_events (
         session_id, type, category, priority, data,
         project_dir, attribution_source, attribution_confidence,
         bytes_avoided, bytes_returned,
         source_hook, data_hash
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`),e(o.getEvents,`SELECT id, session_id, type, category, priority, data,
              project_dir, attribution_source, attribution_confidence,
              bytes_avoided, bytes_returned,
              source_hook, created_at, data_hash
       FROM session_events WHERE session_id = ? ORDER BY id ASC LIMIT ?`),e(o.getEventsByType,`SELECT id, session_id, type, category, priority, data,
              project_dir, attribution_source, attribution_confidence,
              bytes_avoided, bytes_returned,
              source_hook, created_at, data_hash
       FROM session_events WHERE session_id = ? AND type = ? ORDER BY id ASC LIMIT ?`),e(o.getEventsByPriority,`SELECT id, session_id, type, category, priority, data,
              project_dir, attribution_source, attribution_confidence,
              bytes_avoided, bytes_returned,
              source_hook, created_at, data_hash
       FROM session_events WHERE session_id = ? AND priority >= ? ORDER BY id ASC LIMIT ?`),e(o.getEventsByTypeAndPriority,`SELECT id, session_id, type, category, priority, data,
              project_dir, attribution_source, attribution_confidence,
              bytes_avoided, bytes_returned,
              source_hook, created_at, data_hash
       FROM session_events WHERE session_id = ? AND type = ? AND priority >= ? ORDER BY id ASC LIMIT ?`),e(o.getEventCount,"SELECT COUNT(*) AS cnt FROM session_events WHERE session_id = ?"),e(o.getLatestAttributedProject,`SELECT project_dir
       FROM session_events
       WHERE session_id = ? AND project_dir != ''
       ORDER BY id DESC
       LIMIT 1`),e(o.checkDuplicate,`SELECT 1 FROM (
         SELECT type, data_hash FROM session_events
         WHERE session_id = ? ORDER BY id DESC LIMIT ?
       ) AS recent
       WHERE recent.type = ? AND recent.data_hash = ?
       LIMIT 1`),e(o.evictLowestPriority,`DELETE FROM session_events WHERE id = (
         SELECT id FROM session_events WHERE session_id = ?
         ORDER BY priority ASC, id ASC LIMIT 1
       )`),e(o.updateMetaLastEvent,`UPDATE session_meta
       SET last_event_at = datetime('now'), event_count = event_count + 1
       WHERE session_id = ?`),e(o.ensureSession,"INSERT OR IGNORE INTO session_meta (session_id, project_dir) VALUES (?, ?)"),e(o.getSessionStats,`SELECT session_id, project_dir, started_at, last_event_at, event_count, compact_count
       FROM session_meta WHERE session_id = ?`),e(o.getSessionRollup,`SELECT
         COUNT(*) AS tool_calls,
         COALESCE(SUM(CASE WHEN category = 'error' THEN 1 ELSE 0 END), 0) AS errors,
         COUNT(DISTINCT type) AS unique_tools,
         COUNT(DISTINCT CASE WHEN category = 'file' THEN data END) AS unique_files,
         CASE WHEN SUM(CASE WHEN type = 'git_commit' THEN 1 ELSE 0 END) > 0 THEN 1 ELSE 0 END AS has_commit,
         CAST(COALESCE((MAX(strftime('%s', created_at)) - MIN(strftime('%s', created_at))) / 60.0, 0) AS INTEGER) AS duration_min,
         COALESCE(SUM(CASE WHEN type = 'external_ref' THEN 1 ELSE 0 END), 0) AS sources_indexed,
         CAST(COALESCE(SUM(bytes_avoided) / 1024.0, 0) AS INTEGER) AS total_chunks,
         COALESCE(SUM(CASE WHEN type IN ('file_search', 'file_glob') THEN 1 ELSE 0 END), 0) AS search_queries
       FROM session_events
       WHERE session_id = ?`),e(o.getMaxFileEdits,`SELECT COALESCE(MAX(c), 0) AS max_file_edits
       FROM (
         SELECT COUNT(*) AS c
         FROM session_events
         WHERE session_id = ? AND category = 'file' AND type IN ('file_edit', 'file_write')
         GROUP BY data
       )`),e(o.getLatestCommitMessage,`SELECT data
       FROM session_events
       WHERE session_id = ? AND type = 'git_commit'
       ORDER BY id DESC
       LIMIT 1`),e(o.incrementCompactCount,"UPDATE session_meta SET compact_count = compact_count + 1 WHERE session_id = ?"),e(o.getUsageCursor,"SELECT usage_cursor FROM session_meta WHERE session_id = ?"),e(o.setUsageCursor,"UPDATE session_meta SET usage_cursor = ? WHERE session_id = ?"),e(o.upsertResume,`INSERT INTO session_resume (session_id, snapshot, event_count)
       VALUES (?, ?, ?)
       ON CONFLICT(session_id) DO UPDATE SET
         snapshot = excluded.snapshot,
         event_count = excluded.event_count,
         created_at = datetime('now'),
         consumed = 0`),e(o.getResume,"SELECT snapshot, event_count, consumed FROM session_resume WHERE session_id = ?"),e(o.markResumeConsumed,"UPDATE session_resume SET consumed = 1 WHERE session_id = ?"),e(o.claimLatestUnconsumedResume,`UPDATE session_resume
       SET consumed = 1
       WHERE id = (
         SELECT id FROM session_resume
         WHERE consumed = 0
           AND session_id != ?
         ORDER BY created_at DESC, id DESC
         LIMIT 1
       )
       RETURNING session_id, snapshot`),e(o.deleteEvents,"DELETE FROM session_events WHERE session_id = ?"),e(o.deleteMeta,"DELETE FROM session_meta WHERE session_id = ?"),e(o.deleteResume,"DELETE FROM session_resume WHERE session_id = ?"),e(o.searchEvents,`SELECT id, session_id, category, type, data, created_at
       FROM session_events
       WHERE (project_dir = ? OR project_dir = '')
         AND (data LIKE '%' || ? || '%' ESCAPE '\\' OR category LIKE '%' || ? || '%' ESCAPE '\\')
         AND (? IS NULL OR category = ?)
       ORDER BY id ASC
       LIMIT ?`),e(o.getOldSessions,"SELECT session_id FROM session_meta WHERE started_at < datetime('now', ? || ' days')"),e(o.incrementToolCall,`INSERT INTO tool_calls (session_id, tool, calls, bytes_returned)
       VALUES (?, ?, 1, ?)
       ON CONFLICT(session_id, tool) DO UPDATE SET
         calls = calls + 1,
         bytes_returned = bytes_returned + excluded.bytes_returned,
         updated_at = datetime('now')`),e(o.getToolCallTotals,`SELECT COALESCE(SUM(calls), 0) AS calls,
              COALESCE(SUM(bytes_returned), 0) AS bytes_returned
       FROM tool_calls WHERE session_id = ?`),e(o.getToolCallByTool,`SELECT tool, calls, bytes_returned
       FROM tool_calls WHERE session_id = ? ORDER BY calls DESC`),e(o.getEventBytesSummary,`SELECT COALESCE(SUM(bytes_avoided), 0) AS bytes_avoided,
              COALESCE(SUM(bytes_returned), 0) AS bytes_returned
       FROM session_events WHERE session_id = ?`)}insertEvent(e,t,n="PostToolUse",s,i){let a=T("sha256").update(t.data).digest("hex").slice(0,16).toUpperCase(),c=String(s?.projectDir??t.project_dir??this._getSessionProjectDir(e)).trim(),d=String(s?.source??t.attribution_source??"unknown"),u=Number(s?.confidence??t.attribution_confidence??0),v=Number.isFinite(u)?Math.max(0,Math.min(1,u)):0,y=N(i?.bytesAvoided),R=N(i?.bytesReturned),A=this.db.transaction(()=>{if(this.stmt(o.checkDuplicate).get(e,X,t.type,a))return;this.stmt(o.getEventCount).get(e).cnt>=W&&this.stmt(o.evictLowestPriority).run(e),this.stmt(o.insertEvent).run(e,t.type,t.category,t.priority,t.data,c,d,v,y,R,n,a),this.stmt(o.updateMetaLastEvent).run(e)});this.withRetry(()=>A())}bulkInsertEvents(e,t,n="PostToolUse",s,i){if(!t||t.length===0)return;if(t.length===1){this.insertEvent(e,t[0],n,s?.[0],i?.[0]);return}let a=t.map((d,u)=>{let v=T("sha256").update(d.data).digest("hex").slice(0,16).toUpperCase(),y=s?.[u],R=String(y?.projectDir??d.project_dir??this._getSessionProjectDir(e)??"").trim(),A=R===""?"":E(R),M=String(y?.source??d.attribution_source??"unknown"),w=Number(y?.confidence??d.attribution_confidence??0),ne=Number.isFinite(w)?Math.max(0,Math.min(1,w)):0,F=i?.[u],se=N(F?.bytesAvoided),oe=N(F?.bytesReturned);return{event:d,dataHash:v,projectDir:A,attributionSource:M,attributionConfidence:ne,bytesAvoided:se,bytesReturned:oe}}),c=this.db.transaction(()=>{let d=this.stmt(o.getEventCount).get(e).cnt;for(let u of a)this.stmt(o.checkDuplicate).get(e,X,u.event.type,u.dataHash)||(d>=W?this.stmt(o.evictLowestPriority).run(e):d++,this.stmt(o.insertEvent).run(e,u.event.type,u.event.category,u.event.priority,u.event.data,u.projectDir,u.attributionSource,u.attributionConfidence,u.bytesAvoided,u.bytesReturned,n,u.dataHash));this.stmt(o.updateMetaLastEvent).run(e)});this.withRetry(()=>c())}getEvents(e,t){let n=t?.limit??1e3,s=t?.type,i=t?.minPriority;return s&&i!==void 0?this.stmt(o.getEventsByTypeAndPriority).all(e,s,i,n):s?this.stmt(o.getEventsByType).all(e,s,n):i!==void 0?this.stmt(o.getEventsByPriority).all(e,i,n):this.stmt(o.getEvents).all(e,n)}getEventCount(e){return this.stmt(o.getEventCount).get(e).cnt}getEventBytesSummary(e){let t=this.stmt(o.getEventBytesSummary).get(e);return{bytesAvoided:Number(t?.bytes_avoided??0),bytesReturned:Number(t?.bytes_returned??0)}}getLatestAttributedProjectDir(e){return this.stmt(o.getLatestAttributedProject).get(e)?.project_dir||null}_getSessionProjectDir(e){try{return this.db.prepare("SELECT project_dir FROM session_meta WHERE session_id = ?").get(e)?.project_dir||""}catch{return""}}searchEvents(e,t,n,s){try{let i=e.replace(/[%_]/g,c=>"\\"+c),a=s??null;return this.stmt(o.searchEvents).all(n,i,i,a,a,t)}catch{return[]}}getSessionIdsForProject(e){try{let t=E(e);return this.db.prepare(`SELECT DISTINCT session_id
             FROM session_events
            WHERE RTRIM(REPLACE(project_dir, '\\', '/'), '/') = ?`).all(t).map(s=>s.session_id)}catch{return[]}}ensureSession(e,t){this.stmt(o.ensureSession).run(e,t)}getSessionStats(e){return this.stmt(o.getSessionStats).get(e)??null}getSessionRollup(e){let t=this.stmt(o.getSessionRollup).get(e),n=this.stmt(o.getMaxFileEdits).get(e),s=this.stmt(o.getLatestCommitMessage).get(e),i=this.getSessionStats(e),a=(t?.tool_calls??0)>0?t?.unique_files??0:0,c=t?.errors??0,d=Math.min(a,c);return{tool_calls:t?.tool_calls??0,errors:t?.errors??0,unique_tools:t?.unique_tools??0,unique_files:t?.unique_files??0,max_file_edits:n?.max_file_edits??0,has_commit:t?.has_commit??0,commit_message:s?.data??"",edit_test_cycles:d,duration_min:t?.duration_min??0,compact_count:i?.compact_count??0,sources_indexed:t?.sources_indexed??0,total_chunks:t?.total_chunks??0,search_queries:t?.search_queries??0}}incrementCompactCount(e){this.stmt(o.incrementCompactCount).run(e)}getUsageCursor(e){return this.stmt(o.getUsageCursor).get(e)?.usage_cursor??null}setUsageCursor(e,t){this.stmt(o.setUsageCursor).run(t,e)}upsertResume(e,t,n){this.stmt(o.upsertResume).run(e,t,n??0)}getResume(e){return this.stmt(o.getResume).get(e)??null}markResumeConsumed(e){this.stmt(o.markResumeConsumed).run(e)}claimLatestUnconsumedResume(e){let t=this.stmt(o.claimLatestUnconsumedResume).get(e);return t?{sessionId:t.session_id,snapshot:t.snapshot}:null}getLatestSessionId(){try{return this.db.prepare("SELECT session_id FROM session_meta ORDER BY started_at DESC LIMIT 1").get()?.session_id??null}catch{return null}}incrementToolCall(e,t,n=0){let s=Number.isFinite(n)&&n>0?Math.round(n):0;try{this.stmt(o.incrementToolCall).run(e,t,s)}catch{}}getToolCallStats(e){try{let t=this.stmt(o.getToolCallTotals).get(e),n=this.stmt(o.getToolCallByTool).all(e),s={};for(let i of n)s[i.tool]={calls:i.calls,bytesReturned:i.bytes_returned};return{totalCalls:t?.calls??0,totalBytesReturned:t?.bytes_returned??0,byTool:s}}catch{return{totalCalls:0,totalBytesReturned:0,byTool:{}}}}deleteSession(e){this.db.transaction(()=>{this.stmt(o.deleteEvents).run(e),this.stmt(o.deleteResume).run(e),this.stmt(o.deleteMeta).run(e)})()}cleanupOldSessions(e=7){let t=`-${e}`,n=this.stmt(o.getOldSessions).all(t);for(let{session_id:s}of n)this.deleteSession(s);return n.length}pruneOrphanedEvents(){let e=this.db.prepare("DELETE FROM session_events WHERE session_id NOT IN (SELECT session_id FROM session_meta)").run();return Number(e.changes??0)}};export{$ as SessionDB,h as StorageDirectoryError,tt as _resetWorktreeSuffixCacheForTests,re as applyMissingSessionEventsColumns,Ze as clearStorageDirectoryCheckCacheForTests,Je as describeStorageDirectorySource,st as ensureSessionEventsSchema,et as ensureWritableStorageDir,Qe as formatStorageDirectoryError,Ue as getWorktreeSuffix,te as hashProjectDirCanonical,ee as hashProjectDirLegacy,E as normalizeWorktreePath,Ke as resolveContentStorageDir,rt as resolveContentStorePath,Ye as resolveDefaultSessionDir,nt as resolveSessionDbPath,Me as resolveSessionPath,Q as resolveSessionStorageDir,ze as resolveStatsStorageDir};
