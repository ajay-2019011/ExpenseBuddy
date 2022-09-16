export default function Details(props)
{
    return(
        <div  style={{width:'400px'}}>
            <div className="modal-form">
                <div>
                    <b>Transaction ID:</b><br/>{props.id}
                </div>
                <div>
                    <b>Category:</b>&nbsp;{props.category}
                </div>
                <div>
                    <b>Time:</b>&nbsp;{props.timestamp}
                </div>
                <div>
                    <b>Amount:</b>&nbsp;{props.amount}
                </div>
                <div>
                    <b>Currency:</b>&nbsp;{props.currency}
                </div>
                <div>
                    <b>Description:</b>
                        &nbsp;{(props.description==='')?'No Description Provided':props.description}
                </div>
            </div>
        </div>
    )
}