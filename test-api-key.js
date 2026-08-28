const Anthropic = require('@anthropic-ai/sdk');

// Replace this with your actual API key
const API_KEY = 'sk-ant-api03-YOUR_KEY_HERE';

const anthropic = new Anthropic({
  apiKey: API_KEY
});

const modelsToTest = [
  'claude-3-5-sonnet-20241022',
  'claude-3-5-haiku-20241022',
  'claude-3-opus-20240229',
  'claude-3-sonnet-20240229',
  'claude-3-haiku-20240307'
];

async function testModels() {
  console.log('🧪 Testing Anthropic API Key...\n');
  console.log(`Key: ${API_KEY.substring(0, 20)}...${API_KEY.slice(-6)}\n`);

  for (const model of modelsToTest) {
    try {
      const response = await anthropic.messages.create({
        model,
        max_tokens: 50,
        messages: [{
          role: 'user',
          content: 'Say hi'
        }]
      });

      console.log(`✅ SUCCESS: ${model}`);
      console.log(`   Response: ${response.content[0].text}\n`);

      // Found a working model, we're good!
      console.log('🎉 Your API key works! Update .env.local with this key and set USE_DEMO_MODE = false');
      return;

    } catch (error) {
      console.log(`❌ FAILED: ${model}`);
      console.log(`   Status: ${error.status}`);
      console.log(`   Error: ${error.error?.type || 'unknown'}`);
      console.log(`   Message: ${error.error?.message || error.message}\n`);
    }
  }

  console.log('\n⚠️  None of the models worked.');
  console.log('📋 Possible issues:');
  console.log('   1. API key is from a workspace without model access');
  console.log('   2. Regional restrictions (some models not available in India)');
  console.log('   3. Billing needs to be activated on this specific workspace');
  console.log('\n💡 Solution:');
  console.log('   - Check https://console.anthropic.com/settings/workspaces');
  console.log('   - Verify billing is enabled for "Default" workspace');
  console.log('   - Try creating key in a different workspace or org');
}

testModels().catch(console.error);
