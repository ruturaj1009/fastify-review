export const noRoute = async(req,reply)=>{
    reply.code(404).send({ 
        status: false, 
        message: 'Invalid Route',
    });
}