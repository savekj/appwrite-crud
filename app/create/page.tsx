'use client'

import { useRouter } from 'next/navigation'
import React, { ChangeEvent, FormEvent, useState } from 'react'

const CreatePage = () => {

    const [formData, setFormData] = useState({ term: "", interpretation: "" })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const router = useRouter()

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prevData) => (
            {
                ...prevData,
                [e.target.name]: e.target.value,
            }
        ))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.term || !formData.interpretation) {
            // If it has error, it will show below form.
            setError('Please fill in all the fields')
            return
        }

        setError(null)
        setIsLoading(true)

        try {
            const response = await fetch('/api/interpretations', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                throw new Error('Failed to create interpretation.')
            }

            router.push('/')
        } catch (error) {
            console.log(error)
            setError('Something went wrong. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <h2 className='text-2xl font-bold my-8'>Add New Interpreation</h2>
            <form onSubmit={handleSubmit} className='flex gap-3 flex-col'>
                <input
                    type="text"
                    name='term'
                    placeholder='Term'
                    value={formData.term}
                    className='py-1 px-4 border rounded-md'
                    onChange={handleInputChange}
                />
                <textarea
                    name="interpretation"
                    rows={4}
                    placeholder='Interpretation'
                    value={formData.interpretation}
                    className='py-1 px-4 border rounded-md resize-none'
                    onChange={handleInputChange}
                />
                <button
                    className='bg-black text-white mt-5 py-1 px-4 rounded-md cursor-pointer'
                    type='submit'
                    disabled={isLoading}
                >
                    {isLoading ? 'Adding...' : 'Add Interpretation'}
                </button>
            </form>
            {error && <p className='text-red-500 mt-4'>{error}</p>}
        </div>
    )
}

export default CreatePage
