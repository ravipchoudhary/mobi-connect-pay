// Test file to verify OTP email setup
// Run this in browser console after login page loads

async function testOtpEmail() {
  console.log('🔍 Testing OTP Email Configuration...\n');
  
  try {
    // Test 1: Check if environment variables are loaded
    console.log('📧 Environment Check:');
    
    const response = await fetch('/api/test-email-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    
    const result = await response.json();
    console.log('Result:', result);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Copy karo aur browser console mein paste karo
// testOtpEmail()
