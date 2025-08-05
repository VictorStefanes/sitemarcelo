#!/usr/bin/env node

/**
 * Script de Verificação de Integridade
 * Verifica se todos os arquivos estão linkados corretamente após reestruturação
 */

const fs = require('fs');
const path = require('path');

class FileIntegrityChecker {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.baseDir = process.cwd();
    }

    // Verifica se arquivo existe
    checkFileExists(filePath) {
        const fullPath = path.join(this.baseDir, filePath);
        return fs.existsSync(fullPath);
    }

    // Extrai referências de arquivos CSS/JS/IMG de um HTML
    extractReferences(htmlContent) {
        const references = {
            css: [],
            js: [],
            images: []
        };

        // CSS links
        const cssMatches = htmlContent.match(/href="([^"]*\.css)"/g);
        if (cssMatches) {
            references.css = cssMatches.map(m => m.match(/href="([^"]*)"/)[1]);
        }

        // JS scripts
        const jsMatches = htmlContent.match(/src="([^"]*\.js)"/g);
        if (jsMatches) {
            references.js = jsMatches.map(m => m.match(/src="([^"]*)"/)[1]);
        }

        // Images
        const imgMatches = htmlContent.match(/src="([^"]*\.(jpg|jpeg|png|gif|svg|webp))"/gi);
        if (imgMatches) {
            references.images = imgMatches.map(m => m.match(/src="([^"]*)"/i)[1]);
        }

        return references;
    }

    // Verifica um arquivo HTML
    checkHtmlFile(htmlFile) {
        console.log(`🔍 Verificando ${htmlFile}...`);
        
        if (!this.checkFileExists(htmlFile)) {
            this.errors.push(`❌ Arquivo não encontrado: ${htmlFile}`);
            return;
        }

        const content = fs.readFileSync(htmlFile, 'utf8');
        const refs = this.extractReferences(content);

        // Verifica CSS
        refs.css.forEach(cssFile => {
            if (!this.checkFileExists(cssFile)) {
                this.errors.push(`❌ CSS não encontrado em ${htmlFile}: ${cssFile}`);
            }
        });

        // Verifica JS
        refs.js.forEach(jsFile => {
            if (jsFile.startsWith('http')) return; // Skip CDN
            if (!this.checkFileExists(jsFile)) {
                this.errors.push(`❌ JS não encontrado em ${htmlFile}: ${jsFile}`);
            }
        });

        // Verifica imagens
        refs.images.forEach(imgFile => {
            if (imgFile.startsWith('http')) return; // Skip CDN
            if (!this.checkFileExists(imgFile)) {
                this.errors.push(`❌ Imagem não encontrada em ${htmlFile}: ${imgFile}`);
            }
        });

        // Verifica se há referências com ../
        if (content.includes('../')) {
            const matches = content.match(/["']\.\.\/[^"']*/g);
            if (matches) {
                matches.forEach(match => {
                    this.warnings.push(`⚠️ Referência relativa em ${htmlFile}: ${match}`);
                });
            }
        }
    }

    // Verifica estrutura esperada
    checkStructure() {
        console.log('🏗️ Verificando estrutura de pastas...');
        
        const requiredDirs = ['css', 'js', 'assets'];
        const requiredFiles = ['index.html', '_redirects', 'netlify.toml'];

        requiredDirs.forEach(dir => {
            if (!this.checkFileExists(dir)) {
                this.errors.push(`❌ Pasta obrigatória não encontrada: ${dir}`);
            }
        });

        requiredFiles.forEach(file => {
            if (!this.checkFileExists(file)) {
                this.errors.push(`❌ Arquivo obrigatório não encontrado: ${file}`);
            }
        });
    }

    // Executa todas as verificações
    run() {
        console.log('🚀 Iniciando verificação de integridade...\n');

        this.checkStructure();

        // Lista de arquivos HTML para verificar
        const htmlFiles = [
            'index.html',
            'dashboard.html',
            'lancamentos.html',
            'mais-procurados.html',
            'beira-mar.html',
            'pronto-morar.html'
        ];

        htmlFiles.forEach(file => {
            this.checkHtmlFile(file);
        });

        // Relatório final
        console.log('\n📊 RELATÓRIO FINAL:');
        console.log('=' .repeat(50));

        if (this.errors.length === 0) {
            console.log('✅ SUCESSO: Nenhum erro encontrado!');
        } else {
            console.log(`❌ ERROS ENCONTRADOS (${this.errors.length}):`);
            this.errors.forEach(error => console.log(`  ${error}`));
        }

        if (this.warnings.length > 0) {
            console.log(`\n⚠️ AVISOS (${this.warnings.length}):`);
            this.warnings.forEach(warning => console.log(`  ${warning}`));
        }

        console.log('\n' + '=' .repeat(50));
        
        return {
            errors: this.errors.length,
            warnings: this.warnings.length,
            success: this.errors.length === 0
        };
    }
}

// Executa verificação se chamado diretamente
if (require.main === module) {
    const checker = new FileIntegrityChecker();
    const result = checker.run();
    process.exit(result.success ? 0 : 1);
}

module.exports = FileIntegrityChecker;
