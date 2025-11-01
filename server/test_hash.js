const bcrypt = require('bcryptjs');

async function testPassword() {
    const password = '123456';
    
    // Gerar novo hash
    const newHash = await bcrypt.hash(password, 10);
    console.log('\n🔐 Novo hash gerado para senha "123456":');
    console.log(newHash);
    
    // Testar o hash que está no banco
    const dbHash = '$2a$10$rT5Z8qY.9K7P3vX6LmZqduO3jGZhVYHhQw5vBfJLkF7hFhKqZJYxW';
    const isValid = await bcrypt.compare(password, dbHash);
    console.log('\n✅ Hash do banco é válido para "123456"?', isValid);
    
    // Testar com o novo hash
    const isNewValid = await bcrypt.compare(password, newHash);
    console.log('✅ Novo hash é válido para "123456"?', isNewValid);
}

testPassword();
