
    import React from 'react';
    // React bootstrap
    import Row     from 'react-bootstrap/Row';
    import Spinner from 'react-bootstrap/Spinner';
    // Components
    import CarsManagerSidebar from './CarsManagerSidebar';
    import CarsListContainer  from './CarsListContainer';

    import { ErrorMessage } from '../form/FormComponents';
    // Other modules
    import API from '../../data/API';

    import CarRentalException from '../../entity/CarRentalException';

    /*
    * Manages the list of cars and the corresponding filters
    */
    class CarsManager extends React.Component {
        
        constructor(props){
            super(props);
            this.state = {
                allCars:          [],
                allCategories:    [],
                allBrands:        [],
                displayedCars:    [],
                activeCategories: [],
                activeBrands:     [],
                loading:          true,
                errorMessage:     null
            };
        }
        /*
        * Load the cars list
        */
        componentDidMount(){
            
            API.getCars().then( cars => {
                                const brands =     [ ...new Set(cars.map( car => car.getBrand()    )) ].sort();
                                const categories = [ ...new Set(cars.map( car => car.getCategory() )) ].sort();
                                
                                this.setState({
                                    allCars:          cars,
                                    allCategories:    categories,
                                    allBrands:        brands,
                                    displayedCars:    cars,
                                    loading:          false
                                });
                        })
                        .catch( err => {
                            this.setState({ loading: false, errorMessage: new CarRentalException(err, "Cannot retrieve cars").getUserMessage() });
                        });
        }
        
        render(){
            
            if(this.state.loading)
                return <Row className="p-5 justify-content-center">
                            <Spinner variant="info" animation="border"/>
                    </Row>;
                    
            if(this.state.errorMessage)
                return <Row className="p-5 justify-content-center">
                            <ErrorMessage message={this.state.errorMessage}/>
                    </Row>;
                    
            return <>
                        <CarsManagerHeading />
                            
                        
                            
                        <Row className="px-5">
                            <CarsManagerSidebar categories={this.state.allCategories} activeCategories={this.state.activeCategories}
                                                brands={this.state.allBrands} activeBrands={this.state.activeBrands} 
                                                activateFilter={this.activateFilter} deactivateFilter={this.deactivateFilter}
                                                results={this.state.displayedCars.length}/>
                            <CarsListContainer cars={this.state.displayedCars}/>
                        </Row>
                        
                </>;
        }
        
        /*
        * Set the filter corresponding to the pressed button as active
        */
        activateFilter = (type, value) => {

            if( type === 'category' )
                return this.setState( previousState => ({ activeCategories: [ value, ...previousState.activeCategories ]}) , this.filterList);

            this.setState( previousState => ({ activeBrands: [ value, ...previousState.activeBrands ]}) , this.filterList);
        }
        
        /*
        * Set the filter corresponding to the pressed button as not active
        */
        deactivateFilter = (type, value) => {

            if( type === 'category' )
                return this.setState( previousState => ({ activeCategories: previousState.activeCategories.filter( cat => cat !== value) }) , this.filterList);

            this.setState( previousState => ({ activeBrands: previousState.activeBrands.filter( brand => brand !== value ) }) , this.filterList);
        }
        
        /*
        * Computes the list of displayed cars starting from all cars and the active filters
        */
        filterList = () => {
            
            this.setState( previousState => {

                let brandFilter    = () => true;
                let categoryFilter = () => true;
                
                if( previousState.activeCategories.length )
                    categoryFilter = car => previousState.activeCategories.some( cat => cat === car.getCategory() );
                
                if( previousState.activeBrands.length )
                    brandFilter = car => previousState.activeBrands.some( brand => brand === car.getBrand() );
        
                return {
                    displayedCars: previousState.allCars.filter(brandFilter).filter(categoryFilter)
                };

            });
        }
    }

    export default CarsManager;



    function CarsManagerHeading(props){
        
        return <Row className="p-4 d-flex justify-content-center">
                    <h1> Our Cars </h1>
            </Row>;
    }



