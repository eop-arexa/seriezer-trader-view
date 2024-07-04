import { SetMetadata } from '@nestjs/common';
import { COMPRESS_RESPONSE } from '../constants/constant';

export const CompressResponse = () => SetMetadata(COMPRESS_RESPONSE, true);
