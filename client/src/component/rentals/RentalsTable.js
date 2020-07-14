
    import React from 'react';
    // React bootstrap
    import Row   from 'react-bootstrap/Row';
    import Table from 'react-bootstrap/Table';
    // Icons
    import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
    import { faCheck, faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

    /*
    * Table displaying rentals
    */
    function RentalsTable(props){
        
        return <Row className="my-5">
                    <h3 className="m-4">
                        {props.label}
                    </h3>
                    <Table hover>
                        <TableHeader deletePossible={props.deletePossible}/>
                        <tbody>
                            { props.rentals.map( r => <RentalRow key={r.getId()} rental={r} deletePossible={props.deletePossible} delete={props.delete}/> )        
                            }
                        </tbody>
                    </Table>
            </Row>;
    }

    export default RentalsTable;

    /*
    * Each of the table rows
    */
    function RentalRow(props){
        
        const yes = <FontAwesomeIcon icon={faCheck}    className="yes-icon" />;
        const no  = <FontAwesomeIcon icon={faTimes}    className="no-icon"  />; 
        const del = <FontAwesomeIcon icon={faTrashAlt} className="del-icon" />
        
        return <tr>
                    <td> { props.rental.getCategory() }                </td>
                    <td> { props.rental.getStartDate("DD-MM-YYYY") }   </td>
                    <td> { props.rental.getEndDate("DD-MM-YYYY")   }   </td>
                    <td> { props.rental.getDriverAge() }               </td>
                    <td> { props.rental.getDriversNumber() }           </td>
                    <td> { props.rental.getExtraInsurance() ? yes:no}  </td>
                    <td> { props.rental.getKmPerDay() }                </td>
                    <td> { props.rental.getDiscountApplies() ? yes:no} </td>
                    <td> { props.rental.getPrice() + " €" }            </td>
                    { props.deletePossible && <td className="del" onClick={ () => props.delete(props.rental.getId()) }> { del } </td> }
            </tr>; 
    }

    /*
    * Table header
    */
    function TableHeader(props){
        
        return <thead>
                    <tr>
                        <th> Car category    </th>
                        <th> Start date      </th>
                        <th> End date        </th>
                        <th> Driver age      </th>
                        <th> Drivers         </th>
                        <th> Extra insurance </th>
                        <th> Km per day      </th>
                        <th> Discount        </th>
                        <th> Price           </th>
                        { props.deletePossible && <th> Delete </th> }
                    </tr>
            </thead>;
    }
