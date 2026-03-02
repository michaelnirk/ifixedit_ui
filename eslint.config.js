import globals from 'globals';
import { defineConfig, globalIgnores } from 'eslint/config';
import sortKeysFix from 'eslint-plugin-sort-keys-fix';
import stylisticJs from '@stylistic/eslint-plugin-js';
import lodash from 'eslint-plugin-lodash';
import unicorn from 'eslint-plugin-unicorn';
import youDontNeedLodash from 'eslint-plugin-you-dont-need-lodash-underscore';
import react from 'eslint-plugin-react';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat();

export default defineConfig([
	globalIgnores(['dist']),
	...compat.extends('plugin:react-hooks/recommended'),
	{
		languageOptions: {
			ecmaVersion: 2025,
			sourceType: 'module'
		},
		plugins: {
			'@stylistic/js': stylisticJs,
			lodash,
			'sort-keys-fix': sortKeysFix,
			unicorn,
			'you-dont-need-lodash-underscope': youDontNeedLodash
		},
		rules: {
			'@stylistic/js/array-bracket-spacing': [2, 'never'],
			'@stylistic/js/arrow-parens': 2,
			'@stylistic/js/arrow-spacing': 2,
			'@stylistic/js/block-spacing': 2,
			'@stylistic/js/comma-dangle': [2, 'never'],
			'@stylistic/js/comma-spacing': [2, {
				after: true,
				before: false
			}],
			'@stylistic/js/comma-style': [2, 'last'],
			'@stylistic/js/dot-location': [2, 'property'],
			'@stylistic/js/eol-last': 2,
			'@stylistic/js/func-call-spacing': [2, 'never'],
			'@stylistic/js/indent': [2, 'tab', {
				MemberExpression: 1,
				SwitchCase: 1
			}],
			'@stylistic/js/key-spacing': [2, {
				afterColon: true,
				beforeColon: false,
				mode: 'strict'
			}],
			'@stylistic/js/keyword-spacing': [2, {}],
			'@stylistic/js/max-statements-per-line': [2, {
				max: 1
			}],
			'@stylistic/js/no-extra-semi': 2,
			'@stylistic/js/no-mixed-spaces-and-tabs': 2,
			'@stylistic/js/no-multi-spaces': 2,
			'@stylistic/js/no-multiple-empty-lines': [2, {
				max: 1,
				maxBOF: 0,
				maxEOF: 0
			}],
			'@stylistic/js/no-trailing-spaces': 2,
			'@stylistic/js/object-curly-spacing': [2, 'always'],
			'@stylistic/js/object-property-newline': [2, {
				allowAllPropertiesOnSameLine: true
			}],
			'@stylistic/js/padded-blocks': [2, 'never'],
			'@stylistic/js/padding-line-between-statements': [
				2,
				{ blankLine: 'always', next: '*', prev: 'import' },
				{ blankLine: 'never', next: 'import', prev: 'import' }
			],
			'@stylistic/js/quote-props': [2, 'as-needed'],
			'@stylistic/js/quotes': [2, 'single', {
				avoidEscape: true
			}],
			'@stylistic/js/semi': [2, 'always'],
			'@stylistic/js/space-before-blocks': [2, 'always'],
			'@stylistic/js/space-before-function-paren': [2, {
				anonymous: 'always',
				asyncArrow: 'always',
				named: 'never'
			}],
			'@stylistic/js/space-in-parens': [2, 'never'],
			'@stylistic/js/space-infix-ops': 2,
			'@stylistic/js/space-unary-ops': [2, {
				nonwords: false,
				words: false
			}],
			'@stylistic/js/spaced-comment': [2, 'always', {
				block: {
					balanced: true
				}
			}],
			'@stylistic/js/switch-colon-spacing': 2,
			'@stylistic/js/wrap-iife': 2,
			camelcase: 0,
			'consistent-this': [2, 'self'],
			curly: [2, 'all'],
			'dot-notation': 2,
			eqeqeq: [2, 'smart'],
			'guard-for-in': 2,
			'lodash/import-scope': [2, 'method'],
			'no-bitwise': 2,
			'no-caller': 2,
			'no-const-assign': 2,
			'no-constant-condition': 2,
			'no-empty': 2,
			'no-extra-bind': 2,
			'no-loop-func': 2,
			'no-new': 2,
			'no-undef': 2,
			'no-unused-vars': 2,
			'no-use-before-define': [2, {
				functions: false
			}],
			'no-useless-computed-key': 'error',
			'no-var': 2,
			'no-with': 2,
			'one-var': [2, 'never'],
			'prefer-const': 2,
			'sort-keys-fix/sort-keys-fix': [2, 'asc', {
				caseSensitive: false
			}],
			'unicorn/prefer-date-now': 2,
			'unicorn/prefer-node-protocol': 2,
			yoda: [2, 'never']
		}
	},
	{
		files: ['**/*.{js,jsx}'],
		languageOptions: {
			globals: {
				...globals.browser
			},
			parserOptions: {
				ecmaFeatures: { jsx: true },
				ecmaVersion: 'latest',
				sourceType: 'module'
			}
		},
		plugins: {
			react: react
		},
		rules: {
			...react.configs.recommended.rules,
			'comma-dangle': ['error', 'never'],
			'jsx-quotes': 2,
			'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
			'react-hooks/exhaustive-deps': 2,
			'react/jsx-closing-bracket-location': [2, 'after-props'],
			'react/jsx-closing-tag-location': 2,
			'react/jsx-curly-brace-presence': 2,
			'react/jsx-curly-newline': [2, {
				multiline: 'require'
			}],
			'react/jsx-equals-spacing': [2, 'never'],
			'react/jsx-first-prop-new-line': 2,
			'react/jsx-indent': [2, 'tab'],
			'react/jsx-max-props-per-line': [2, {
				maximum: {
					multi: 1,
					single: 2
				}
			}],
			'react/jsx-no-leaked-render': [2, {
				validStrategies: ['coerce', 'ternary']
			}],
			'react/jsx-pascal-case': 2,
			'react/jsx-tag-spacing': [2, {
				beforeSelfClosing: 'always'
			}],
			'react/jsx-wrap-multilines': 2,
			'react/no-unused-prop-types': 2,
			'react/self-closing-comp': 2,
			'react/sort-prop-types': 2,
			'sort-keys': 0
		},
		settings: {
			react: {
				version: 'detect'
			}
		}
	},
	{
		files: ['**/*.spec.{js,jsx}', 'src/test/**/*.js'],
		languageOptions: {
			globals: {
				afterAll: true,
				afterEach: true,
				beforeAll: true,
				describe: true,
				expect: true,
				it: true,
				vi: true
			}
		}
	}
]);
