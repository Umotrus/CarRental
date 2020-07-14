
    import React from 'react';
    // React bootstrap
    import Container from 'react-bootstrap/Container';
    import  Table    from 'react-bootstrap/Table';

    /*
    * Displays the cars list resulting from filters
    */
    function CarsListContainer(props){
        
        return <Container className="pt-5">
                    <Table hover>
                        <thead>
                            <tr>
                                <th> Brand    </th>
                                <th> Model    </th>
                                <th> Category </th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.cars.length !== 0 ? props.cars.map( c => <CarRow key={c.getId()} car={c} />) : <tr><td> No cars </td></tr> }
                        </tbody>
                    </Table>
            </Container>;
    }

    export default CarsListContainer;

    /*
    * Row of the cars table
    */
    function CarRow(props){
        return <tr>
                    <td> { props.car.getBrand()    } </td>
                    <td> { props.car.getModel()    } </td>
                    <td> { props.car.getCategory() } </td>
            </tr>;
    }






