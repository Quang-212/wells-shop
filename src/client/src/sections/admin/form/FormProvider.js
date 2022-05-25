import React from 'react'
import { FormProvider as Form } from 'react-hook-form'

export default function FormProvider({ methods, onSubmit, children }) {

    return (
        <Form {...methods}>
            <form onSubmit={onSubmit}>
                {children}
            </form>
        </Form>
    )
}
