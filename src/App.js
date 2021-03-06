import React, { Fragment } from 'react';
import './App.css';
import ComputerDisplay from './ComputerDisplay.js';
import QueueDisplay from './QueueDisplay.js';
import BuildHistoryDisplay from './BuildHistoryDisplay.js';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const App = () => (
  <Router basename={process.env.PUBLIC_URL + '/'}>
    <div className="App">
      <header className="App-header">
        <h1 className="App-title"><Link to="/">ci.pytorch.org HUD</Link> (<a href="https://github.com/ezyang/pytorch-ci-hud">GitHub</a>)</h1>
      </header>
      <ul className="menu">
        {[
         "pytorch",
         "tensorcomp",
         "translate",
         "rocm-pytorch",
        ].map((e) => <Fragment key={e}>
                        {["master", "pull-request"
                        ].map((trigger) => <li key={e + "-" + trigger}>
                          <Link to={"/build/" + e + "-" + trigger}>{e}-{trigger}</Link>&nbsp;
                          (<Link to={"/build/" + e + "-" + trigger + "?mode=perf"}>perf</Link>/
                           <Link to={"/build/" + e + "-" + trigger + "?mode=cost"}>cost</Link>
                           {e === "pytorch" && trigger === "master" ? <Fragment>/<Link to={"/build/" + e + "-" + trigger + "?mode=binary"}>binary</Link></Fragment> : <Fragment />}
                           )
                          </li>)}
                      </Fragment>)}
        <Fragment key="nightlies-uploaded"><li><Link to={"/build/nightlies-uploaded"}>nightlies-uploaded</Link></li></Fragment>
      </ul>
      <Route exact path="/" component={Home} />
      <Route path="/build" component={BuildRoute} />
    </div>
  </Router>
);

//    <ul className="menu">
//      {[
//       "linux-trusty-py2.7-trigger",
//       "linux-trusty-py2.7.9-trigger",
//       "linux-trusty-py3.5-trigger",
//       "linux-trusty-py3.6-gcc4.8-trigger",
//       "linux-trusty-py3.6-gcc5.4-trigger",
//       "linux-trusty-py3.6-gcc7.2-trigger",
//       "linux-trusty-pynightly-trigger",
//       "linux-xenial-cuda8-cudnn6-py3-trigger",
//       "linux-xenial-cuda9-cudnn7-py2-trigger",
//       "linux-xenial-cuda9-cudnn7-py3-trigger",
//       "linux-xenial-py3-clang5-asan-trigger",
//       "win-ws2016-cuda9-cudnn7-py3-trigger",
//      ].map((e) => <li key={e}><Link to={"/build/pytorch-builds/job/pytorch-" + e}>{e}</Link></li>)}
//    </ul>

const Home = () => (
  <div>
    <QueueDisplay interval={1000} />
    <ComputerDisplay interval={1000} />
  </div>
);

const Build = ({ match }) => {
  // Uhhh, am I really supposed to rob window.location here?
  const query = new URLSearchParams(window.location.search);
  return <BuildHistoryDisplay interval={60000} job={match.url.replace(/^\/build\//, '')} mode={query.get('mode')} />
};

const BuildRoute = ({ match }) => (
  <Fragment>
    <Route exact path={match.url} component={Build} />
    <Route path={`${match.url}/:segment`} component={BuildRoute} />
  </Fragment>
);

export default App;
