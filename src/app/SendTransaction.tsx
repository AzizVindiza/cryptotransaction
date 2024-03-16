'use client'

import React from 'react';
import {Button, TextField, CircularProgress, Typography} from '@mui/material';
import { BaseError, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

export function SendTransaction() {
    const {
        data: hash,
        error,
        isPending,
        sendTransaction
    } = useSendTransaction()

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const to = formData.get('address') as `0x${string}`
        const value = formData.get('value') as string
        sendTransaction({ to, value: parseEther(value) })
    }

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        })

    return (
        <>
            <Typography variant="h6">Send Transaction</Typography>
            <form onSubmit={submit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <TextField name="address" label="Address" variant="outlined" placeholder="0xA0Cf…251e" required/>
                <TextField name="value" label="Value" variant="outlined" placeholder="0.05" required/>
                <Button
                    disabled={isPending}
                    type="submit"
                    variant="contained"
                    disableElevation
                >
                    {isPending ? <CircularProgress size={24}/> : 'Send'}
                </Button>
                {hash && <div>Transaction Hash: {hash}</div>}
                {isConfirming && <div>Waiting for confirmation...</div>}
                {isConfirmed && <div>Transaction confirmed.</div>}
                {error && (
                    <div>Error: {(error as BaseError).shortMessage || error.message}</div>
                )}
            </form>
        </>
    )
}
