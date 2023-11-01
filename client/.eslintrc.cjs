/* eslint-env node */

module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: true,
        tsconfigRootDir: __dirname,
    },
    plugins: ['react', 'react-refresh'],
    settings: {
        react: {
            version: 'detect'
        },
    },
    rules: {
        'react-refresh/only-export-components': [
            'warn',
            { allowConstantExport: true },
        ],
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        'camelcase': [
            'error', {
                properties: 'always'
            }
        ],
        'prefer-const': 'off',
        'eqeqeq': 'error',
        'jsx-quotes': ['error', 'prefer-double'],
        'react/button-has-type': 'warn',
        'react/jsx-no-literals': 'warn',
        'react/jsx-equals-spacing': [2, 'never'],
        'react/jsx-tag-spacing': [
            'error', {
                closingSlash: 'never'
            }
        ],
        'react-hooks/exhaustive-deps': 'off',
        'linebreak-style': ['error', 'windows'],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'curly': 'error',
        'indent': [
            'error', 4,
            { SwitchCase: 1 }
        ],
    },
    'overrides': [
        {
            'files': [
                './src/hooks/*.ts'
            ],
            'rules': {
                '@typescript-eslint/no-explicit-any': 'off'
            }
        }
    ]
};