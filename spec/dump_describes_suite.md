##Test suite 'dump_describes'

###(describe) 'making a suite'
	 it -> 'should return a promise'
	 it -> 'should throw if not given a file'
	 it -> 'should throw if not given a generator'

	(describe) 'when given input'

		(describe) 'bad input'
			 it -> 'should throw if given a non-existent file'
			 it -> 'should throw if given bad input'

		(describe) 'good input'
			 it -> 'should succeed when given an existing file'
			 it -> 'should succeed when given good input'

	(describe) 'no-ops'
		 it -> 'should not return any results when given invalid code'
		 it -> 'should not return any results when given code with errors'
		 it -> 'should not return any results when given invalid input'
		 it -> 'should not return any results when given input with errors'

	(describe) 'verbose'
		 it -> 'should be off by default'
		 it -> 'should be `false` when set'
		 it -> 'should be `true` when set'

	(describe) 'when part of return statements'

		(describe) 'describe blocks'
			 it -> 'should work when returned from a block (file)'
			 it -> 'should work when returned from a block (input)'

		(describe) 'it blocks'
			 it -> 'should work when returned from a block (file)'
			 it -> 'should work when returned from a block (input)'

	(describe) 'suite and spec titles'

		(describe) 'describe blocks'

			(describe) 'ArrowFunctionExpression'
				 it -> 'should have file support'
				 it -> 'should have input support'

			(describe) 'AssignmentExpression'
				 it -> 'should have file support'
				 it -> 'should have input support'

			(describe) 'BinaryExpression'
				 it -> 'should have file support'
				 it -> 'should have input support'

			(describe) 'CallExpression'
				 it -> 'should have file support'
				 it -> 'should have input support'

			(describe) 'ConditionalExpression'
				 it -> 'should have file support'
				 it -> 'should have input support'

			(describe) 'FunctionExpression'
				 it -> 'should have file support'
				 it -> 'should have input support'

			(describe) 'MemberExpression'
				 it -> 'should have file support'
				 it -> 'should have input support'

			(describe) 'TemplateLiteral'
				 it -> 'should have file support'
				 it -> 'should have input support'

			(describe) 'UnaryExpression'
				 it -> 'should have file support'
				 it -> 'should have file support'

		(describe) 'it blocks'

			(describe) 'ArrowFunctionExpression'
				 it -> 'should have file support'
				 it -> 'should have input support'

			(describe) 'AssignmentExpression'
				 it -> 'should have file support'
				 it -> 'should have input support'

			(describe) 'BinaryExpression'
				 it -> 'should have file support'
				 it -> 'should have input support'

			(describe) 'CallExpression'
				 it -> 'should have file support'
				 it -> 'should have input support'

			(describe) 'ConditionalExpression'
				 it -> 'should have file support'
				 it -> 'should have input support'

			(describe) 'FunctionExpression'
				 it -> 'should have file support'
				 it -> 'should have input support'

			(describe) 'MemberExpression'
				 it -> 'should have file support'
				 it -> 'should have input support'

			(describe) 'TemplateLiteral'
				 it -> 'should have file support'
				 it -> 'should have input support'

			(describe) 'UnaryExpression'
				 it -> 'should have file support'
				 it -> 'should have input support'