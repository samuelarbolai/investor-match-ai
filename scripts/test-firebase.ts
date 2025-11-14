import { db } from '../src/config/firebase';

async function testFirebaseConnection() {
  try {
    console.log('Testing Firebase connection...');
    
    // Test write
    const testDoc = db.collection('test').doc('connection-test');
    await testDoc.set({ timestamp: new Date(), test: true });
    console.log('✅ Write test successful');
    
    // Test read
    const doc = await testDoc.get();
    if (doc.exists) {
      console.log('✅ Read test successful');
      console.log('Data:', doc.data());
    }
    
    // Cleanup
    await testDoc.delete();
    console.log('✅ Delete test successful');
    
    console.log('🎉 Firebase connection test completed successfully!');
  } catch (error) {
    console.error('❌ Firebase connection test failed:', error);
    process.exit(1);
  }
}

testFirebaseConnection();
