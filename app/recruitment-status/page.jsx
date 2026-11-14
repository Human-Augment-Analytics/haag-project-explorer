import './page.css';
import {
  getRecruitmentStatus,
  formatDisplayValue,
  phaseStates,
  currentPhaseLabel,
} from '../../lib/data';

export const metadata = {
  title: 'HAAG Recruitment Status',
};

export default function RecruitmentStatusPage() {
  const data = getRecruitmentStatus();
  const phases = phaseStates(data);
  const updated = formatDisplayValue(data.last_updated) || 'unknown';

  return (
    <>
      <div className="gt-topbar">
        <span className="site-name">Human-Augmented Analytics Group</span>
        <span className="site-tag">HAAG</span>
      </div>
      <div className="gt-goldbar"></div>
      <div className="wrap">
        <h1>Recruitment Status</h1>
        <p className="subtitle">Where we currently stand in the recruitment cycle</p>
        <div id="content">
          <div className="status-banner">
            <div>
              <div className="label">Current Phase</div>
              <div className="phase">{currentPhaseLabel(data)}</div>
            </div>
            <div className="cycle">{data.cycle_name || ''}</div>
          </div>

          <div className="updated">Last updated: {updated}</div>

          {data.notes ? <div className="notes">{String(data.notes).trim()}</div> : null}

          <div className="timeline">
            {phases.map((p, i) => (
              <div className={`phase-row ${p.state}`} key={p.key || i}>
                <div className="rail">
                  <div className={`dot ${p.state}`}>{p.state === 'complete' ? '✓' : i + 1}</div>
                  {!p.isLast && <div className={`line ${p.state === 'complete' ? 'complete' : ''}`}></div>}
                </div>
                <div className="phase-content">
                  <span className="phase-label">{p.label}</span>
                  {p.state === 'current' && <span className="badge current">CURRENT</span>}
                  {p.state === 'complete' && <span className="badge complete">COMPLETE</span>}
                  <div className="phase-desc">{p.description || ''}</div>
                </div>
              </div>
            ))}
          </div>

          {data.contact ? (
            <div className="contact">
              Questions about this cycle? <a href={data.contact}>Contact HAAG</a>
            </div>
          ) : null}
        </div>
        <div className="footer-tag">Georgia Institute of Technology · HAAG</div>
      </div>
    </>
  );
}
