import React from 'react'
import { TextField, Grid } from '@material-ui/core';
import { useFormContext, Controller } from 'react-hook-form';

const FormInput = ({ name, label, required }) => {
    const { control } = useFormContext();

    // create form input function component format using react hook form

    return (
        <Grid item xs={12} sm={6}>
            <Controller 
                as={TextField}
                name={name}
                control={control}
                label={label}
                fullWidth
                required={required}
            />
        </Grid>
    )
}

export default FormInput 
