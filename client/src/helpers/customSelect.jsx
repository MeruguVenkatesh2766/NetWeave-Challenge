import React from 'react';
import { Autocomplete, TextField, MenuItem } from '@mui/material';

const CustomSelect = ({ value, onChange, options, defaultLabel }) => {
    return (
        <Autocomplete
            sx={{ width: '100%' }}
            size='small'
            value={value}
            onChange={(e, value)=> onChange(defaultLabel,value)}
            options={options}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
                <TextField {...params} label={`Select ${defaultLabel}`} />
            )}
        />
    );
};

export default CustomSelect;
