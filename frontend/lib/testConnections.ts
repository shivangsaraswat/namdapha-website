// Test Firebase and Redis connections
import { db } from './firebase';
import { redis } from './redis';
import { collection, getDocs, limit, query } from 'firebase/firestore';

export async function testFirebaseConnection(): Promise<boolean> {
  try {
    const q = query(collection(db, 'communityUsers'), limit(1));
    await getDocs(q);
    console.log('✅ Firebase connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return false;
  }
}

export async function testRedisConnection(): Promise<boolean> {
  try {
    await redis.set('test_key', 'test_value', { ex: 10 });
    const value = await redis.get('test_key');
    await redis.del('test_key');
    console.log('✅ Redis connected successfully');
    return value === 'test_value';
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    return false;
  }
}

export async function testAllConnections() {
  console.log('🔍 Testing connections...\n');
  
  const firebaseOk = await testFirebaseConnection();
  const redisOk = await testRedisConnection();
  
  console.log('\n📊 Connection Status:');
  console.log(`Firebase: ${firebaseOk ? '✅ Connected' : '❌ Failed'}`);
  console.log(`Redis: ${redisOk ? '✅ Connected' : '⚠️  Using in-memory fallback'}`);
  
  return { firebaseOk, redisOk };
}
