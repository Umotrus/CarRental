
    import React from 'react';
    // React bootstrap
    import Col from 'react-bootstrap/Col';
    import Row from 'react-bootstrap/Row';
    import ListGroup from 'react-bootstrap/ListGroup';


    /*
    * Sidebar containing filters
    */
    function CarsManagerSidebar(props){
    
        return <Col className="col-3">
                    <Results results={props.results}/>
                    <CategoryFilters activateFilter={props.activateFilter} deactivateFilter={props.deactivateFilter} categories={props.categories} active={props.activeCategories} />
                    <BrandFilters    activateFilter={props.activateFilter} deactivateFilter={props.deactivateFilter} brands={props.brands} active={props.activeBrands}/>
            </Col>;
    }

    export default CarsManagerSidebar;

    /*
    * Component displaying the number of results
    */
    function Results(props){
        
        return <Row className="border-bottom">
                    <Col>
                        <h3>{"Results: " + props.results}</h3>
                    </Col>
            </Row>;
    }

    /*
    * Filters on car category
    */
    function CategoryFilters(props){
        
        const deactivate = (value) => { props.deactivateFilter('category', value); };
        const activate   = (value) => { props.activateFilter('category', value);   };

        return <Row className="my-4">
                    <Col>
                        <h3> Categories </h3>
                        
                        <ListGroup horizontal>
                            { props.categories.map( cat => {
                                
                                const isActive = props.active.some( c => c === cat );
                                
                                
                                return <Filter key={cat} value={cat} active={isActive} onClick={ isActive ? deactivate : activate } /> 
                                
                            })
                            }
                        </ListGroup>
                    </Col>
            </Row>;
    }
    
    /*
    * Filters on car brand
    */
    function BrandFilters(props){
        
        const deactivate = (value) => { props.deactivateFilter('brand', value); };
        const activate   = (value) => { props.activateFilter('brand', value);   };

        return <Row>
                    <Col>
                        <h3> Brands </h3>
                        
                        <ListGroup>
                            { props.brands.map( brand => {
                                
                                const isActive = props.active.some( b => b === brand );
                                
                                
                                return <Filter key={brand} value={brand} active={isActive} onClick={ isActive ? deactivate : activate } /> 
                                
                            })
                            }
                        </ListGroup>
                    </Col>
            </Row>;
    }

    /*
    * Filter Component
    */
    function Filter(props){
        
        return <ListGroup.Item className="text-center" onClick={ () => props.onClick(props.value) } action active={props.active} variant={props.active ? "primary":"info"}>
                    {props.value}
            </ListGroup.Item>
    }



