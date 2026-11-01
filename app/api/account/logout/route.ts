import {customerSessionPost} from '@/lib/customer-server';
export const POST = (req: Request) => customerSessionPost(req, 'logout');
