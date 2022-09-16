import {Bar} from 'react-chartjs-2';

export default function BarChart(props)
{
  const properties = {
    labels: props.categories,
    datasets: [
      {
        label: props.label,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,0)',
        borderWidth: 2,
        data: props.data
      }
    ]
  }
    return (
      <div className="chart-container">
        <center style={{paddingTop:'50px',color:'#707070'}}><h1>{props.title}</h1></center>
        <Bar
          data={properties}
        />
      </div>
    );
}
