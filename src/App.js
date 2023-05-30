import React from "react";
import {
  Gitgraph,
  templateExtend,
  TemplateName,
  Orientation
} from "@gitgraph/react";
import Grid from '@mui/material/Grid';
import "./App.css";

const withoutAuthor = templateExtend(TemplateName.Metro, {
  branch: {
    lineWidth: 4,
    label: {
      font: "normal 10pt Calibri"
    },
    spacing: 24
  },
  commit: {
    spacing: 44,
    dot: {
      size: 8
    },
    message: {
      displayAuthor: false,
      font: "normal 10pt Calibri",
      displayHash: false
    }
  }
});

function Draw({ fn, caption }) {
  return (
    <div className="graph">
      <Gitgraph
        options={{
          reverseArrow: true,
          template: withoutAuthor
        }}
      >
        {fn.bind(this)}
      </Gitgraph>
      {caption && <div className="caption">Caption: {caption}</div>}
    </div>
  );
}

export default function App() {
  return (
    <div className="App">
      <div className="title">Learning Version Control Techniques</div>
      <div className="row">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <h1>Merge</h1>
            <Grid sx={{ mt: 25 }} item >
              <Draw fn={g1} caption="initial state" />
              <Draw fn={g2} caption="working on JIRA-001" />
              <Draw fn={g3} caption="Merge JIRA-001 to main" />
              <div className="command">git merge feature-branch</div>
            </Grid>

          </Grid>
          <Grid item xs={6}>
            <h1>Rebase</h1>
            <Draw fn={g1} caption="initial state" />
            <Draw fn={rebaseG2} caption="working on JIRA-001" />
            <Draw fn={rebaseG3} caption="Rebase JIRA-001 from main" />
            <div className="command">git rebase feature-branch</div>
          </Grid>

        </Grid>
      </div>
      <div className="row">
        <h1>Squash & Merge</h1>
        <Draw fn={squashAndMerge1} caption="initial state" />
        <Draw fn={squashAndMerge2} caption="working on JIRA-001" />
        <Draw fn={squashAndMerge3} caption="After applying squash command" />
        <Draw fn={squashAndMerge4} caption="Merge JIRA-001 to main" />
        <div className="command">git rebase -i "commit-hash-or-identifier"</div>
      </div>
      <div className="row">
        <h1>Stash</h1>
        <Draw fn={stashG1} caption="initial state" />
        <Draw fn={stashG2} caption="working on JIRA-001" />
        <Draw fn={stashG3} caption="stashing changes" />
        <Draw fn={stashG4} caption="Adding changes to feature/JIRA-001" />
        <div className="command">git stash save "Your stash message"</div>
      </div>
      <div className="row">
        <h1>Cherry Pick</h1>
        <Draw fn={cherryPick1} caption="initial state" />
        <Draw fn={cherryPick2} caption="After applying cherry-pick" />
        <div className="command">git cherry-pick "commit-hash-or-identifier"</div>
      </div>
      <div className="row">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <h1>Reset commit</h1>
            <Draw fn={resetCommit1} caption="initial state" />
            <Draw fn={resetCommit2} caption="Reset to commit" />
            <div className="command">git reset --soft/mixed/hard "commit-hash-or-identifier"</div>
          </Grid>
          <Grid item xs={6}>
            <h1>Reverse commit</h1>
            <Draw fn={resetCommit1} caption="initial state" />
            <Draw fn={reverseCommit2} caption="Reverting 'Add feature C'" />
            <div className="command">git revert "commit-hash-or-identifier"</div>
          </Grid>
        </Grid>

      </div>
      <div className="row">
        <h1>Rebase branch after another feature is merged</h1>
        <Draw fn={g1} caption="initial state" />
        <Draw
          fn={gr1}
          caption="working on JIRA-002 simultaneously with JIRA-001"
        />
        <Draw fn={gr2} caption="Rebase JIRA-002 to main" />
        <Draw fn={gr3} caption="Merge JIRA-002 to main" />
      </div>
      <div className="row">
        <h1>Aligning development before merging</h1>
        <Grid container spacing={2} direction="row"
          justifyContent="center"
          alignItems="center">
          <Grid item >
            <Draw fn={g1} caption="initial state" />
            <Draw
              fn={mergeWorkingBranches1}
              caption="working on JIRA-002 simultaneously with JIRA-001"
            />
            <Draw fn={mergeWorkingBranches2} caption="Merge JIRA-002 to JIRA-001" />
            <Draw fn={mergeWorkingBranches3} caption="Merge JIRA-001 to main" />
          </Grid>
          <Grid item >
            <Draw fn={g1} caption="initial state" />
            <Draw
              fn={mergeWorkingBranches1}
              caption="working on JIRA-002 simultaneously with JIRA-001"
            />
            <Draw fn={rebaseWorkingBranches1} caption="Rebase JIRA-001 onto JIRA-002" />
            <Draw fn={rebaseWorkingBranches2} caption="Merge JIRA-001 to main" />
          </Grid>
        </Grid>
      </div>
      <div className="row">
        <h1>Hotfix workflow</h1>
        <Draw fn={gh1} caption="initial state" />
        <Draw fn={gh2} caption="Hotfix branch from main" />
        <Draw fn={gh3} caption="Squash commits and merge to main" />
        <Draw
          fn={gh4}
          caption="Cherry-pick hotfix commit and tag for release"
        />
      </div>
    </div>
  );
}

function gh1(gitgraph) {
  const main = gitgraph.branch("main");

  main.commit("Initial commit");
  main.commit("JIRA-001 Feature A");
  main.commit("JIRA-002 Feature B");
  main.tag("v5.13.0");

  const j3 = main.branch("feature/jira-003");
  j3.commit("Implement and tested");
  main.merge(j3);
  j3.delete();
}

function gh2(gitgraph) {
  const main = gitgraph.branch("main");

  main.commit("Initial commit");
  main.commit("JIRA-001 Feature A");
  main.commit("JIRA-002 Feature B");
  main.tag("v5.13.0");

  const j3 = main.branch("feature/jira-003");
  j3.commit("Implement and tested");
  main.merge(j3);
  j3.delete();

  const hf = main.branch("hotfix/jira-004");
  hf.commit("fix bug");
  hf.commit("add tests and everything works");
  hf.commit("update version");
}

function gh3(gitgraph) {
  const main = gitgraph.branch("main");

  main.commit("Initial commit");
  main.commit("JIRA-001 Feature A");
  main.commit("JIRA-002 Feature B");
  main.tag("v5.13.0");

  const j3 = main.branch("feature/jira-003");
  j3.commit("Implement and tested");
  main.merge(j3);
  j3.delete();

  const hf = main.branch("hotfix/jira-004");
  hf.commit("fix bug & tests");
  main.merge(hf);
}

function gh4(gitgraph) {
  const main = gitgraph.branch("main");

  main.commit("Initial commit");
  main.commit("JIRA-001 Feature A");
  main.commit("JIRA-002 Feature B");
  main.tag("v5.13.0");
  const re = main.branch("release/v5.13.1");

  const j3 = main.branch("feature/jira-003");
  j3.commit("Implement and tested");
  main.merge(j3);
  j3.delete();
  const hf = main.branch("hotfix/jira-004");
  hf.commit("fix bug & tests");
  main.merge(hf);
  main.checkout();

  re.commit("Cherry-pick: hotfix/jira-004");
  re.tag("v5.13.1");
}

function gr1(gitgraph) {
  const main = gitgraph.branch("main");

  main.commit("Initial commit");
  main.commit("another old commit");

  const j1 = main.branch("feature/jira-001");
  j1.commit("Finished JIRA-001");

  const j2 = main.branch("feature/jira-002");
  j2.commit("add database");
  j2.commit("add model");
  j2.commit("add controller and test");

  main.merge(j1);
}

function gr2(gitgraph) {
  const main = gitgraph.branch("main");

  main.commit("Initial commit");
  main.commit("another old commit");

  const j1 = main.branch("feature/jira-001");
  j1.commit("Finished JIRA-001");
  main.merge(j1);

  const j2 = main.branch("feature/jira-002");
  j2.commit("add database");
  j2.commit("add model");
  j2.commit("add controller and test");
}

function gr3(gitgraph) {
  const main = gitgraph.branch("main");

  main.commit("Initial commit");
  main.commit("another old commit");

  const j1 = main.branch("feature/jira-001");
  j1.commit("Finished JIRA-001");
  main.merge(j1);

  const j2 = main.branch("feature/jira-002");
  j2.commit("add database");
  j2.commit("add model");
  j2.commit("add controller and test");
  main.merge(j2);
}

function g1(gitgraph) {
  const main = gitgraph.branch("main");

  main.commit("Initial commit");
  main.commit("another old commit");
}

function g2(gitgraph) {
  const main = gitgraph.branch("main");

  main.commit("Initial commit");
  main.commit("another old commit");

  const j1 = main.branch("feature/jira-001");
  j1.commit("implement UI");
  j1.commit("add more tests");
  j1.commit("fix bug");
}

function g3(gitgraph) {
  const main = gitgraph.branch("main");

  main.commit("Initial commit");
  main.commit("another old commit");

  const j1 = main.branch("feature/jira-001");
  j1.commit("implement UI");
  j1.commit("add more tests");
  j1.commit("fix bug");

  main.merge(j1);
}

function squashAndMerge1(gitgraph) {
  const main = gitgraph.branch("main");

  main.commit("Initial commit");
  main.commit("Second commit");
}

function squashAndMerge2(gitgraph) {
  const main = gitgraph.branch("main");

  main.commit("Initial commit");
  main.commit("Second commit");

  const j1 = main.branch("feature/jira-001");
  j1.commit("implement UI");
  j1.commit("add more tests");
  j1.commit("fix bug");

  main.commit("");
}

function squashAndMerge3(gitgraph) {
  const main = gitgraph.branch("main");

  main.commit("Initial commit");
  main.commit("Second commit");

  const j1 = main.branch("feature/jira-001");
  j1.commit("Commit squashed");

  main.commit("");
}

function squashAndMerge4(gitgraph) {
  const main = gitgraph.branch("main");

  main.commit("Initial commit");
  main.commit("Second commit");

  const j1 = main.branch("feature/jira-001");
  j1.commit("Commit squashed");

  main.merge(j1);
}

function rebaseG2(gitgraph) {
  const main = gitgraph.branch("main");

  main.commit("Initial commit");
  main.commit("another old commit");

  const j1 = main.branch("feature/jira-001");
  j1.commit("implement UI");

  j1.commit("fix bug");


  main.commit("manager services added");
  main.commit("prettier passed");

  main.commit("add more tests");
}

function rebaseG3(gitgraph) {
  const main = gitgraph.branch("main");

  main.commit("Initial commit");
  main.commit("another old commit");

  const j1 = main.branch("feature/jira-001");

  main.commit("manager services added");
  main.commit("prettier passed");
  main.commit("add more tests");

  j1.commit("manager services added");
  j1.commit("prettier passed");
  j1.commit("add more tests");

  j1.commit("implement UI");
  j1.commit("fix bug");

}

function stashG1(gitgraph) {
  const main = gitgraph.branch("main");

  main.commit("Initial commit");
  main.commit("");
}

function stashG2(gitgraph) {
  const master = gitgraph.branch('master');
  master.commit('Initial commit');

  const featureBranch = master.branch('feature/jira-001');
  featureBranch.commit('implement UI');
  featureBranch.commit('test passed');

  master.commit('Fix bug');
}

function stashG3(gitgraph) {
  const master = gitgraph.branch('master');
  master.commit('Initial commit');

  const featureBranch = master.branch('feature/jira-001');
  featureBranch.commit('implement UI');
  featureBranch.commit('test passed');

  master.commit('Fix bug');

  const stash = gitgraph.branch('stash');
  stash.commit('Stash changes');

  featureBranch.commit('add services');
}

function stashG4(gitgraph) {
  const master = gitgraph.branch('master');
  master.commit('Initial commit');

  const featureBranch = master.branch('feature/jira-001');
  featureBranch.commit('implement UI');
  featureBranch.commit('test passed');

  master.commit('Fix bug');

  const stash = gitgraph.branch('stash');
  stash.commit('Stash changes');

  featureBranch.commit('add services');

  featureBranch.merge(stash);

  featureBranch.commit('Add feature');
}

function cherryPick1(gitgraph) {
  const master = gitgraph.branch('master');
  master.commit('Initial commit');

  const featureBranch1 = master.branch('feature/jira-001');
  featureBranch1.commit('Add feature 1A');
  featureBranch1.commit('Add feature 1B');

  const featureBranch2 = master.branch('feature/jira-002');
  featureBranch2.commit('Add feature 2A');

  master.commit('Second commit');
}

function cherryPick2(gitgraph) {
  const master = gitgraph.branch('master');
  master.commit('Initial commit');

  const featureBranch1 = master.branch('feature/jira-001');
  featureBranch1.commit('Add feature 1A');
  featureBranch1.commit('Add feature 1B');

  const featureBranch2 = master.branch('feature/jira-002');
  featureBranch2.commit('Add feature 2A');

  master.commit('Second commit');

  featureBranch2.commit('feature 1A (cherry-pick)');
}

function resetCommit1(gitgraph) {
  const master = gitgraph.branch('master');
  master.commit('Initial commit');

  const featureBranch = master.branch('feature/jira-001');
  featureBranch.commit('Add feature A');
  featureBranch.commit('Add feature B');

  const develop = master.branch('develop');
  develop.commit('Add feature C');
  develop.commit('Add feature D');

  const bugFixBranch = develop.branch('bugfix/issue');
  bugFixBranch.commit('');

  featureBranch.commit('Add feature E');
  featureBranch.commit('Add feature F');

  develop.commit('');
  master.commit('');
}

function resetCommit2(gitgraph) {
  const master = gitgraph.branch('master');
  master.commit('Initial commit');

  const featureBranch = master.branch('feature/jira-001');
  featureBranch.commit('Add feature A');
  featureBranch.commit('Add feature B');

  const develop = master.branch('develop');
  develop.commit('Add feature C - Reset to this commit');

  featureBranch.commit('Add feature E');
  featureBranch.commit('Add feature F');

  master.commit('');
}

function reverseCommit2(gitgraph) {
  const master = gitgraph.branch('master');
  master.commit('Initial commit');

  const featureBranch = master.branch('feature/jira-001');

  featureBranch.commit('Add feature A');
  featureBranch.commit('Add feature B');

  const develop = master.branch('develop');
  develop.commit('Add feature C');
  develop.commit('Add feature D');

  const bugFixBranch = develop.branch('bugfix/issue');
  bugFixBranch.commit('');

  featureBranch.commit('Add feature E');
  featureBranch.commit('Add feature F');

  develop.commit('Add feature G');
  develop.commit('Revert "Add feature C"');
  master.commit('');
}

function mergeWorkingBranches1(gitgraph) {
  const main = gitgraph.branch("main");

  main.commit("Initial commit");
  main.commit("another old commit");

  const j1 = main.branch("feature/jira-001");
  j1.commit("add services");

  const j2 = main.branch("feature/jira-002");
  j2.commit("add database");
  j1.commit("add new navbar");
  j2.commit("add model");
  j2.commit("add controller and test");
}

function mergeWorkingBranches2(gitgraph) {
  const main = gitgraph.branch("main");

  main.commit("Initial commit");
  main.commit("another old commit");

  const j1 = main.branch("feature/jira-001");
  j1.commit("add services");

  const j2 = main.branch("feature/jira-002");
  j2.commit("add database");
  j1.commit("add new navbar");
  j2.commit("add model");
  j2.commit("add controller and test");

  j1.merge(j2);
}

function mergeWorkingBranches3(gitgraph) {
  const main = gitgraph.branch("main");

  main.commit("Initial commit");
  main.commit("another old commit");

  const j1 = main.branch("feature/jira-001");
  j1.commit("add services");

  const j2 = main.branch("feature/jira-002");
  j2.commit("add database");
  j1.commit("add new navbar");
  j2.commit("add model");
  j2.commit("add controller and test");

  j1.merge(j2);
  j1.commit("implement UI");
  main.merge(j1);
}

function rebaseWorkingBranches1(gitgraph) {
  const main = gitgraph.branch("main");

  main.commit("Initial commit");
  main.commit("another old commit");

  const j1 = main.branch("feature/jira-001");
  const j2 = main.branch("feature/jira-002");

  j1.commit("add database");
  j1.commit("add model");
  j1.commit("add controller and test");
  j1.commit("add services");
  j1.commit("add new navbar");

  j2.commit("add database");
  j2.commit("add model");
  j2.commit("add controller and test");

}

function rebaseWorkingBranches2(gitgraph) {
  const main = gitgraph.branch("main");

  main.commit("Initial commit");
  main.commit("another old commit");

  const j1 = main.branch("feature/jira-001");
  const j2 = main.branch("feature/jira-002");

  j1.commit("add database");
  j1.commit("add model");
  j1.commit("add controller and test");
  j1.commit("add services");
  j1.commit("add new navbar");

  j2.commit("add database");
  j2.commit("add model");
  j2.commit("add controller and test");

  main.merge(j1);

}
