import React, { useEffect, useState } from 'react'
import axios from 'axios';
import './Banks.css';
import DropdownButton from 'react-bootstrap/DropdownButton'
import {Dropdown} from 'react-bootstrap';
import { Link } from "react-router-dom"
import Navigationbar from "./Navigationbar"


const FIFTEEN_MINUTE = 1000 * 60 * 15;
export default function Movies(props) {

    let style = {
                fontSize: '0.8rem',
                fontWeight: 'bold',
                lineHeight: '1.1'
            }

    const [state, setState] = useState({
        banks: undefined,
        currPage: 1,
        limit: 10,
        limitInput:10,
        tRows: 0,
        error: undefined,
        city: null,
        category: null,
        fav: [],
        tableData:[],
    });

    const [currSearchText,setCurrSearchText]=useState(undefined)


    const handleChange = (e) => {
        let val = e.target.value;

        setCurrSearchText(val)
    }

    const handleChangeLimit = (e) => {

        let { value, min, max } = e.target;
        if(value.length>0){
            value = Math.max(Number(min), Math.min(Number(max), Number(value)));
        }
        setState({
            ...state,
            limitInput: value,

        })
    }
    const handleNextPage = (totalRows) => {

        let tp = Math.ceil(totalRows/ limit);
        if (state.currPage + 1 > tp) {
            setState({ ...state, error: 'No more pages to show' });
            setTimeout(() => {
                setState({ ...state, error: undefined });
            }, 2000);
            return;
        }
        setState({ ...state, currPage: currPage + 1 });

    }
    const handlePrevPage = () => {

        if (state.currPage <= 1) {
            setState({ ...state, error: 'Pages cannot be less than 1' });
            setTimeout(() => {
                setState({ ...state, error: undefined });
            }, 2000);
            return;
        }
        setState({ ...state, currPage: currPage - 1 });


    }    

    const changeCity=  (event)=>{
   
        setState({ ...state, city: event,currPage:1})
        setCurrSearchText("")
    }
    
    const handleLimit = () => {
        if(state.limitInput!==undefined && state.limitInput!==""&&state.limitInput!==0)
        setState({...state,limit:state.limitInput})
        else{
            setState({...state,limit:10})
        }
    }

    const handleCategory = (e) => {
        setCurrSearchText("")
        setState({ ...state, category: e})
    }

    const handleSubmit = async () => {
        if (state.city === null) {
            setState({ ...state, error: 'Please select a state' });
            setTimeout(() => {
                setState({ ...state, error: undefined });
            }, 2000);
            return;
        }
        else if (state.category === null&& currSearchText!=="") {
            setState({ ...state, error: 'Please select a category' });
            setTimeout(() => {
                setState({ ...state, error: undefined });
            }, 2000);
            return;
        }
        let catchedData = JSON.parse(localStorage.getItem('data'));
        let dataFromAPI;
        if (!catchedData[state.city]) {
            dataFromAPI = await axios.get(`https://vast-shore-74260.herokuapp.com/banks?city=${state.city}`);   
            let items = JSON.parse(localStorage.getItem('data'));
            items = { ...items, [state.city]: { 'stuff': dataFromAPI.data, exp: new Date().getTime() + FIFTEEN_MINUTE } };
            try {
                localStorage.setItem('data', JSON.stringify(items))
            }
            catch (error) {
                console.log(error); 
            }
            dataFromAPI = dataFromAPI.data;
        }
        else
            dataFromAPI = catchedData[state.city].stuff;
            
        if (currSearchText !== '') {
            try{
            dataFromAPI = dataFromAPI.filter(obj => obj[state.category].toLowerCase().includes((currSearchText ? currSearchText.toLowerCase() : currSearchText)))
            }catch(error){
                console.log(error);
            }
            if (dataFromAPI.length === 0) {
                setState({ ...state, banks: [] });
                return;
            }
        }

        setState({ ...state, tRows: dataFromAPI.length })
        setState({ ...state, banks: dataFromAPI })

    }

    const handleFav = (currObj) => {
        if (currObj.fav) {
            currObj.fav = false;
            let oldFav=JSON.parse(localStorage.getItem("fav"));
            
            let newFav = oldFav.filter((bankifsc) => {
                return (bankifsc !== currObj.ifsc);
            })
            setState({ ...state, fav: newFav });

            localStorage.setItem("fav",JSON.stringify( newFav));

        } else {
            currObj.fav = true;
            
            let favCopy=JSON.parse( localStorage.getItem("fav"));
            if(favCopy===undefined){
                favCopy=[];
            }
            favCopy.push(currObj.ifsc);
            setState({ ...state, fav: favCopy }); 

            localStorage.setItem("fav",JSON.stringify( favCopy));
        }
        
    }

    
    useEffect(() => {

        if (currSearchText === undefined) {
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            handleSubmit();
        }, 800)

        return () => clearTimeout(delayDebounceFn)

    }, [currSearchText])

    useEffect(()=>{
        if (state.limitInput === undefined) {
            return;
        }
        const delayDebouncelimitFn = setTimeout(() => {
            handleLimit();
        }, 1000)

        return () => clearTimeout(delayDebouncelimitFn)
    },[state.limitInput])

    useEffect(async () => {
        let cachedData = JSON.parse(localStorage.getItem('data')); 
        for (const key in cachedData) {
            const expiry = cachedData[key].exp
            if (expiry && expiry <= Date.now()) {
                delete cachedData[key]
            }

        }
        
        let city 
        city=(state.city===null)? 'MUMBAI':state.city;

        let dataFromAPI = await axios.get(`https://vast-shore-74260.herokuapp.com/banks?city=${city}`);
        cachedData = { ...cachedData, [city]: { 'stuff': dataFromAPI.data, exp: new Date().getTime() + FIFTEEN_MINUTE } }
    
        setState({
            ...state,
            banks: dataFromAPI.data,
            tRows: dataFromAPI.data.length
        })
        
        try {
            
            localStorage.setItem('data', JSON.stringify(cachedData));   
        }
        catch (error) {
            console.log(error);
        }
        
    }, [state.city])

    useEffect(()=>{
        setState({...state,currPage:1})
    },[props.location.pathname])

    let { banks, currPage, limit } = state; 
    let filteredArr = banks;
    if(props.location.pathname==='/favourites')
    {
        let fav=JSON.parse(localStorage.getItem("fav"));
        filteredArr = (fav===undefined) ? [] :  filteredArr?.filter((bankObj)=>(fav.includes(bankObj.ifsc)))

    }
    let numberofPage = Math.ceil(filteredArr?.length / limit);
   
    let pageNumberArr = [];
    for (let i = 0; i < numberofPage; i++) {
        pageNumberArr.push(i + 1);
    }
    let si = (currPage - 1) * limit;
    let ei = Math.min(si + limit,filteredArr?.length);
    let totalRows=filteredArr?.length;
    filteredArr = filteredArr?.slice(si, ei);

    return (
        <>
            {state.error ? <><div className="alert alert-danger" role="alert">
                {state.error}
            </div></> : state.banks === undefined ? <div className="container"><div className="center">
                <div className="spinner-border text-danger" role="status" >
                    <span className="visually-hidden">Loading...</span>
                </div></div></div> :
                <div>
                <Navigationbar/>

                
              <div className='container'>
                  
                  <div className='header'>

                      <DropdownButton onSelect={changeCity} id="dropdown-variants-Danger"  variant="danger" key="Danger"
                      title={state.city === null ? 'Select City' : `${state.city}`} >
                          <Dropdown.Item eventKey="DELHI">Delhi</Dropdown.Item>
                          <Dropdown.Item eventKey="MUMBAI">Mumbai</Dropdown.Item>
                          <Dropdown.Item eventKey="BANGALORE">Bangalore</Dropdown.Item>
                          <Dropdown.Item eventKey="HARYANA">Haryana</Dropdown.Item>
                          <Dropdown.Item eventKey="HYDERABAD">Hyderabad</Dropdown.Item>
                      </DropdownButton>
                      <DropdownButton id="dropdown-variants-Danger"  variant="danger" key="Danger"
                      onSelect={handleCategory} title={state.category === null ? 'Select Category' : `${state.category}`}>
                          <Dropdown.Item eventKey="ifsc">IFSC</Dropdown.Item>
                          <Dropdown.Item eventKey="branch">Branch</Dropdown.Item>
                          <Dropdown.Item eventKey="bank_name">Bank_name</Dropdown.Item>
                      </DropdownButton>
                      <input type='search' value={currSearchText} onChange={handleChange} ></input>  


                  </div>
                  <div className='row'>

                      <div className='col-10'>

                          <div>
                              <table className="table">
                                  <thead>
                                      <tr>
                                          <th scope="col">Bank</th>          
                                          <th scope="col">IFSC</th>
                                          <th scope="col">Branch</th>
                                          <th scope="col">Bank Id</th>
                                          <th scope="col">Address</th>

                                          <th></th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      {
                                       
                                          filteredArr.map((bankObj) => {
                                              
                                            
                                              return (
                                                  <tr key={bankObj.ifsc} >
                                                      <td style={style}><Link to={
                                                          {
                                                              pathname: `/bank-details/${bankObj.ifsc}`,
                                                              aboutProps: {
                                                                  name: bankObj.bank_name,
                                                                  branch: bankObj.branch,
                                                                  bank_id: bankObj.bank_id,
                                                                  address: bankObj.address,
                                                                  ifsc: bankObj.ifsc,
                                                              }
                                                          }}> {bankObj.bank_name}</Link></td>
                                                      <td style={style}>{bankObj.ifsc}</td>
                                                      <td style={style}>{bankObj.branch}</td>
                                                      <td style={style}>{bankObj.bank_id}</td>
                                                      <td style={style}>{bankObj.address}</td>
                                                      <td>
                                                          <span class="material-icons-outlined"
                                                              onClick={(e) => {
                                                                  let fav=JSON.parse(localStorage.getItem("fav"));
                                                                  if(fav!==undefined&&fav.includes(bankObj.ifsc))
                                                                    e.currentTarget.innerText="favorite_border"
                                                                  else{
                                                                      e.currentTarget.innerText="favorite"
                                                                  }
                                                                  handleFav(bankObj);
                                                              }}
                                                            
                                                              >
                                                              {(JSON.parse(localStorage.getItem("fav"))!==undefined&&JSON.parse(localStorage.getItem("fav")).includes(bankObj.ifsc))?
                                                                   "favorite":"favorite_border"}
                                                          </span>
                                                      </td>

                                                  </tr>
                                              )
                                          })
                                      }
                                  </tbody>
                              </table>
                          </div>
                          <div className='footer'>
                              <h5>
                                  Rows per page: <input min="1" max="100" class="limitInput" onChange={handleChangeLimit} type="number" value={state.limitInput} />
                              </h5>

                              <div>
                                  <i onClick={handlePrevPage} className="fa fa-chevron-left" aria-hidden="true"></i>
                                  {'   '}{si + 1}-{ei} of {totalRows}{'   '}
                                  <i onClick={()=>handleNextPage(totalRows)} className="fa fa-chevron-right" aria-hidden="true"></i>
                              </div>
                          </div>

                      </div>
                  </div>
              </div>

                </div>
            }
        </>
    )
}


