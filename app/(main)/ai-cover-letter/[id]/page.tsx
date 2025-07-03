import React from 'react'

const CoverLetter = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    return (
        <div>CoverLetter{id}</div>
    );
}

export default CoverLetter