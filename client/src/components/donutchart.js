import {Doughnut} from 'react-chartjs-2';

export default function DonutChart(props)
{
  const properties = {
    labels: ['Food','Fuel','Home','Shopping','Other'],
    datasets: [
      {
        label: 'Expenses By Category',
        backgroundColor: [
          '#B21F00',
          '#C9DE00',
          '#2FDE00',
          '#00A6B4',
          '#6800B4'
        ],
        hoverBackgroundColor: [
        '#501800',
        '#4B5000',
        '#175000',
        '#003350',
        '#35014F'
        ],
        borderColor: 'rgba(0,0,0,0)',
        borderWidth: 2,
        data: props.data
      }
    ]
  }
    return (
        <div className="chart-container">
          <center style={{paddingTop:'50px',color:'#707070'}}><h1>{props.title}</h1></center>
          <Doughnut
            data={properties}
          />
        </div>
      );
}