import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { TextField } from '@mui/material'
export default function RHFTextField({ name, ...other }) {
    const { control } = useFormContext()
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <TextField {...field} fullWidth error={error} helperText={error?.message} {...other} />
            )}
        />

    )
}
