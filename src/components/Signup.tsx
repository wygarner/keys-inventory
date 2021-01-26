import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import { AuthComponent } from '../styles/styles'

export default function Signup() {
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const passwordConfirmRef = useRef<HTMLInputElement>(null)
  const { signup } : any = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState<boolean>(false) 
  const history = useHistory()

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()

    if (passwordRef.current!.value !== passwordConfirmRef.current!.value) {
      return setError('Passwords do not match.')
    }

    try {
      setError('')
      setLoading(true)
      await signup(emailRef.current!.value, passwordRef.current!.value)
      history.push('/')
    } catch {
      setError('Failed to create account.')
    }
    setLoading(false)
  }

  return (
    <>
    <AuthComponent>
      <Card style={{width: 500}}>
        <Card.Body>
          <h2 className= "text-center mb-4">Sign up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" autoComplete="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" autoComplete="new-password" ref={passwordRef} required />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" autoComplete="new-password" ref={passwordConfirmRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">Sign up</Button>
          </Form>
        </Card.Body>
      </Card> 
      <div className='w-100 text-center mt-2'>
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </AuthComponent>
    </>
  )
}
