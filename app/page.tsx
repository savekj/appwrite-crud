'use client'

import Link from "next/link";
import { useEffect, useState } from "react";

interface IInterpretation {
  // This ID create automatically by appwrite DB
  $id: string;
  term: string;
  interpretation: string
}

export default function Home() {

  const [interpretations, setInterpretations] = useState<IInterpretation[]>([])
  const [isLoading, setIsloading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInterpretations = async () => {
      setIsloading(true)

      try {
        const response = await fetch('/api/interpretations')

        if (!response.ok) {
          throw new Error('Failed to fetch interpretations')
        }

        const data = await response.json()
        setInterpretations(data)
      } catch (error) {
        console.error("Error: ", error)
        setError('Failed to load interpretations. Please try reloading the page.')
      } finally {
        setIsloading(false)
      }
    }

    fetchInterpretations()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/interpretations/${id}`, {
        method: "DELETE"
      })

      setInterpretations((prevInterpretation) =>
        prevInterpretation?.filter((i) => i.$id !== id)
      )
    } catch (error) {
      setError('Failed to delete interpretation. Please try again.')
    }
  }

  return (
    <div>
      {error && <p className="py-4 text-red-500">{error}</p>}
      {isLoading ? (<p>Loading interpretations...</p>) :
        interpretations?.length > 0 ?
          (<div>
            {interpretations?.map(interpretation => (
              <div key={interpretation.$id} className="p-4 my-2 rounded-md border-b leading-8">
                <div className="font-bold">{interpretation.term}</div>
                <div>{interpretation.interpretation}</div>
                <div className="flex gap-4 mt-4 justify-end">
                  <Link className="bg-slate-200 py-2 px-4 rounded-md uppercase text-sm font-bold tracking-widest" href={`/edit/${interpretation.$id}`}>Edit</Link>
                  <button onClick={() => handleDelete(interpretation.$id)} className="bg-red-500 text-white py-2 px-4 rounded-md uppercase text-sm font-bold tracking-widest">Delete</button>
                </div>
              </div>
            ))}
          </div>) : (<p>No interpretations found.</p>)}
    </div>
  );
}
