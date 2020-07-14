
    import React from 'react';
    // React bootstrap
    import Form    from 'react-bootstrap/Form';
    import Alert   from 'react-bootstrap/Alert';
    import Button  from 'react-bootstrap/Button';
    import Spinner from 'react-bootstrap/Spinner';

    // Components containing field label and input

    const ErrorMessage = function(props){
        
        return <Alert variant="danger" className="text-center">
                    { props.message }
            </Alert>;
    }


    const TextInput = function(props){
        
        return <Form.Group>
                    <Form.Label>
                        { props.label }
                    </Form.Label>
                    <Form.Control type="text" name={props.name} value={props.value} onChange={ e => {props.onChange(e.target.name, e.target.value)} } placeholder={props.label} required={props.required}/>
            </Form.Group>;
    }

    const PasswordInput = function(props){
        
        return <Form.Group>
                    <Form.Label>
                        { props.label }
                    </Form.Label>
                    <Form.Control type="password" name={props.name} value={props.value} onChange={ e => {props.onChange(e.target.name, e.target.value)} } placeholder={props.label} required={props.required}/>
            </Form.Group>;
    }

    const SelectInput = function(props){
        
        return <Form.Group>
                    <Form.Label>
                        { props.label }
                    </Form.Label>
                    <Form.Control as="select" name={props.name} value={props.value} onChange={ e => {props.onChange(e.target.name, e.target.value)} } placeholder={props.label} required={props.required}>
                        { props.options && props.options.map( o => <option key={o}> {o} </option> )}
                    </Form.Control>
            </Form.Group>;
    }

    const CheckboxInput = function(props){
        
        return <Form.Group>
                    <Form.Label>
                        { props.label }
                    </Form.Label>
                    <Form.Check className="d-flex justify-content-center py-1" type="checkbox" name={props.name} checked={props.value} onChange={ e => {props.onChange(e.target.name, e.target.checked)} }/>
            </Form.Group>;
    }

    const NumberInput = function(props){
        
        return <Form.Group>
                    <Form.Label>
                        { props.label }
                    </Form.Label>
                    <Form.Control type="number" name={props.name} value={props.value} onChange={ e => {props.onChange(e.target.name, e.target.value)} } min={props.min} required={props.required}/>
            </Form.Group>;
    }

    const DateInput = function(props){
        
        return <Form.Group>
                    <Form.Label>
                        {props.label}
                    </Form.Label>
                    <Form.Control type="date" name={props.name} value={props.value} onChange={ e => {props.onChange(e.target.name, e.target.value)} } required={props.required}/>
            </Form.Group>;
    }

    const SubmitButton = function(props){
        
        return <Form.Group className={"d-flex justify-content-center " + (props.className || "") }>
                    <Button onClick={props.onClick} variant={props.variant} disabled={props.loading || props.disabled}>
                        {
                            props.loading ? 
                                <>
                                    Loading...
                                    <Spinner animation="border" size="sm"/>
                                </>
                                :
                                props.label
                        }
                    </Button>
            </Form.Group>;
    }

    export { ErrorMessage, TextInput, PasswordInput, SelectInput, CheckboxInput, NumberInput, DateInput, SubmitButton };
