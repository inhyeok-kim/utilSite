import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import Calculator from './utils/Calculator/Calculator';

function App() {
  return (
    <div className="App">
      <Grid2 sx={{width:'480px'}}>
        <Calculator/>
      </Grid2>
    </div>
  );
}

export default App;
