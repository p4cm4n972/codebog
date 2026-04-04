import { Client, Databases, Query } from 'node-appwrite';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });

// Correction pour __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Configuration ---
const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const APPWRITE_API_KEY = process.env.NEXT_APPWRITE_KEY;
const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const C_EXERCISES_COLLECTION_ID = 'c-exercises';

// --- Validation des variables d'environnement ---
if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID || !APPWRITE_API_KEY || !APPWRITE_DATABASE_ID) {
    console.error('Erreur: Les variables d\'environnement Appwrite ne sont pas définies.');
    console.error('Vérifiez .env.local pour:');
    console.error('  - NEXT_PUBLIC_APPWRITE_ENDPOINT');
    console.error('  - NEXT_PUBLIC_APPWRITE_PROJECT_ID');
    console.error('  - NEXT_APPWRITE_KEY');
    console.error('  - NEXT_PUBLIC_APPWRITE_DATABASE_ID');
    process.exit(1);
}

// --- Initialisation du client Appwrite ---
const appwriteClient = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

const databases = new Databases(appwriteClient);

// --- Interfaces ---
interface Exercise {
    $id: string;
    slug: string;
    title: string;
    week?: string;
    day?: string;
    statement?: string;
    starterCode?: string;
    testCode?: string;
    solution?: string;
    order?: number;
}

interface AuditResult {
    id: string;
    slug: string;
    title: string;
    status: 'operational' | 'partial' | 'unusable';
    issues: string[];
}

// --- Fonctions d'audit ---

function isNonEmpty(value: any): boolean {
    return value !== null && value !== undefined && String(value).trim().length > 0;
}

function hasValidTestOutput(testCode: string): boolean {
    if (!testCode) return false;
    
    // Cherche des indicateurs de sortie attendue
    const indicators = [
        /SORTIE\s+ATTENDUE/i,
        /OUTPUT/i,
        /EXPECTED/i,
        /résultat/i,
        /result/i,
        /assert/i,
        /printf/i,
        /return/i
    ];
    
    return indicators.some(indicator => indicator.test(testCode));
}

async function auditExercises(): Promise<void> {
    console.log('\n🔍 AUDIT DES EXERCICES C EN BASE APPWRITE');
    console.log('='.repeat(60));
    
    const results: AuditResult[] = [];
    let offset = 0;
    const limit = 100;
    let totalFetched = 0;
    let hasMore = true;

    try {
        // Récupération pagée de tous les exercices
        while (hasMore) {
            console.log(`\n📥 Récupération des exercices (offset: ${offset}, limit: ${limit})...`);
            
            const response = await databases.listDocuments(
                APPWRITE_DATABASE_ID,
                C_EXERCISES_COLLECTION_ID,
                [Query.limit(limit), Query.offset(offset)]
            );

            const exercises = response.documents as unknown as Exercise[];
            console.log(`   Reçu: ${exercises.length} exercices`);
            
            if (exercises.length === 0) {
                hasMore = false;
                break;
            }

            // Audit de chaque exercice
            for (const exercise of exercises) {
                const issues: string[] = [];

                // Vérifications
                if (!isNonEmpty(exercise.statement)) {
                    issues.push('statement manquant ou vide');
                }

                if (!isNonEmpty(exercise.starterCode)) {
                    issues.push('starterCode manquant ou vide');
                }

                if (!isNonEmpty(exercise.testCode)) {
                    issues.push('testCode manquant ou vide');
                } else if (!hasValidTestOutput(exercise.testCode)) {
                    issues.push('testCode sans sortie attendue exploitable');
                }

                if (!isNonEmpty(exercise.solution)) {
                    issues.push('solution manquante ou vide');
                }

                // Détermination du statut
                let status: 'operational' | 'partial' | 'unusable';
                if (issues.length === 0) {
                    status = 'operational';
                } else if (issues.length <= 2) {
                    status = 'partial';
                } else {
                    status = 'unusable';
                }

                results.push({
                    id: exercise.$id,
                    slug: exercise.slug,
                    title: exercise.title,
                    status,
                    issues
                });
            }

            totalFetched += exercises.length;
            offset += limit;

            // Vérifier s'il y a plus de documents
            if (exercises.length < limit) {
                hasMore = false;
            }
        }

        // Affichage des résultats
        console.log('\n' + '='.repeat(60));
        console.log('📋 RÉSULTATS DÉTAILLÉS');
        console.log('='.repeat(60) + '\n');

        const operationalResults = results.filter(r => r.status === 'operational');
        const partialResults = results.filter(r => r.status === 'partial');
        const unusableResults = results.filter(r => r.status === 'unusable');

        // Affichage des exercices opérationnels
        if (operationalResults.length > 0) {
            console.log(`✅ OPÉRATIONNELS (${operationalResults.length})\n`);
            operationalResults.forEach(result => {
                console.log(`  ✓ ${result.slug}`);
                console.log(`    Titre: ${result.title}`);
            });
        }

        // Affichage des exercices partiels
        if (partialResults.length > 0) {
            console.log(`\n⚠️  PARTIELS (${partialResults.length})\n`);
            partialResults.forEach(result => {
                console.log(`  ⚠ ${result.slug}`);
                console.log(`    Titre: ${result.title}`);
                console.log(`    Manquant: ${result.issues.join(', ')}`);
            });
        }

        // Affichage des exercices inutilisables
        if (unusableResults.length > 0) {
            console.log(`\n❌ INUTILISABLES (${unusableResults.length})\n`);
            unusableResults.forEach(result => {
                console.log(`  ✗ ${result.slug}`);
                console.log(`    Titre: ${result.title}`);
                console.log(`    Manquant: ${result.issues.join(', ')}`);
            });
        }

        // Résumé final
        console.log('\n' + '='.repeat(60));
        console.log('📊 RÉSUMÉ FINAL');
        console.log('='.repeat(60));
        console.log(`\nTotal d'exercices audités: ${results.length}`);
        console.log(`✅ Opérationnels: ${operationalResults.length}/${results.length} (${Math.round(operationalResults.length / results.length * 100)}%)`);
        console.log(`⚠️  Partiels: ${partialResults.length}/${results.length} (${Math.round(partialResults.length / results.length * 100)}%)`);
        console.log(`❌ Inutilisables: ${unusableResults.length}/${results.length} (${Math.round(unusableResults.length / results.length * 100)}%)`);

        if (operationalResults.length === results.length) {
            console.log('\n🎉 Tous les exercices sont opérationnels!');
        } else {
            const totalIssues = results.length - operationalResults.length;
            console.log(`\n⚡ ${totalIssues} exercice(s) nécessite(nt) des corrections.`);
        }

        console.log('\n');

    } catch (error) {
        console.error('Erreur lors de la récupération des exercices:', error);
        process.exit(1);
    }
}

// --- Fonction principale ---
async function main() {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 AUDIT CODEBOG - EXERCICES C');
    console.log('='.repeat(60));
    console.log(`\nEndpoint: ${APPWRITE_ENDPOINT}`);
    console.log(`Database: ${APPWRITE_DATABASE_ID}`);
    console.log(`Collection: ${C_EXERCISES_COLLECTION_ID}`);

    await auditExercises();
}

main().catch(error => {
    console.error('\n❌ Une erreur inattendue est survenue:', error);
    process.exit(1);
});
