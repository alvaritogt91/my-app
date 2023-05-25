import './App.css';
import { Gitgraph } from "@gitgraph/react";
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function App() {
  return (
    <Box sx={{ border: '1px dashed grey' }}>
      <Box sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mt: 2,
      }}>
        <Typography variant="h1" component="div" gutterBottom>
          Merge
        </Typography>
      </Box>

      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
          <Gitgraph>
            {(gitgraph) => {
              // Simulate git commands with Gitgraph API.
              const master = gitgraph.branch("master");
              master.commit("Initial commit");

              const develop = master.branch("develop");
              develop.commit("Add TypeScript");

              const aFeature = develop.branch("a-feature");
              aFeature
                .commit("Make it work")
                .commit("Make it right")
                .commit("Make it fast");

              develop.merge(aFeature);
              develop.commit("Prepare v1");

              master.merge(develop).tag("v1.0.0");

              var master1 = gitgraph.branch('master').commit('Initial commit');
              var develop1 = gitgraph.branch('develop');
              develop1.commit('one');
              master1.commit('two');
              develop1.commit('three');
              master1.merge(develop1);
            }}
          </Gitgraph>
        </Grid>
        <Grid item xs={6} >
          <Box sx={{ textAlign: 'center', mt: 10, ml: 30, maxWidth: 500 , }}>
            <Typography sx={{ fontSize:20}} component="div" gutterBottom>
              In Git, a merge combines changes from one branch into another. It integrates the changes made in the source branch into the target branch, creating a new commit that incorporates both sets of changes. Merging allows for collaboration and combining different branches' work into a unified branch.
            </Typography>

          </Box>
        </Grid>

      </Grid>



    </Box>
  );
}

export default App;
