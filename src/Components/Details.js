import { useState } from 'react'
import Table from 'react-bootstrap/Table' 
import './Details.css'

export default function Details(props) {
    const [state, setState] = useState({
        bank_name: props.location.aboutProps.name,
        branch: props.location.aboutProps.branch,
        bank_id: props.location.aboutProps.bank_id,
        address: props.location.aboutProps.address,
        ifsc: props.location.aboutProps.ifsc,


    })
    return (<>
        
            <h1>{state.bank_name}</h1>
            <div class="table">
        <Table>
        <tbody>
            
        <tr>
          <th>Bank-ID</th>
          <td>{state.bank_id}</td>
        </tr>
        <tr>
          <th>IFSC</th>
          <td>{state.ifsc}</td>
        </tr>
        <tr>
          <th>Branch</th>
          <td>{state.branch}</td>
        </tr>
        <tr>
          <th>Address</th>
          <td>{state.address}</td>
        </tr>
       
     
      </tbody>
    </Table>

        </div>
    </>)

}