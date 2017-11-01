//  <!--
//   ! Foo
//   !-->
export const angleBangDashDash = {
	open: /^[\t ]*?<!--/,
	close: /!-->/,
	indent: /[\t !-]*/
};

//  !>
//  !! Foo
//  !!
export const bangBang = {
	open: /^(?=[\t ]*?![<!>])/,
	close: /^(?![\t ]*?![<!>])/,
	indent: /[\t <!>]*/
};

//  =begin
//  Foo
//  =end
export const beginEnd = {
	open: /^=begin/,
	close: /^=end/,
	indent: /[\t ]*/
};

//  {-|
//   - Foo
//   -}
export const curlyDashPipe = {
	open: /^[\t ]*?\{-\|/,
	close: /-\}/,
	indent: /[\t -]*/
};

//  {##
//   # Foo
//   #}
export const curlyHashHash = {
	open: /^[\t ]*?\{##/,
	close: /#\}/,
	indent: /[\t #]*/
};

//  {%%
//   % Foo
//   %}
export const curlyPercPerc = {
	open: /^[\t ]*?\{%%/,
	close: /%\}/,
	indent: /[\t %]*/
};

//  --!
//  --! Foo
//  --!
export const dashDashBang = {
	open: /^(?=[\t ]*?--!)/,
	close: /^(?![\t ]*?--!)/,
	indent: /[\t !-]*/
};

//  ""
//  " Foo
export const doubleDouble = {
	open: /^[\t ]*?""/,
	close: /^(?![\t ]*?")/,
	indent: /[\t "]*/
};

//  """
//  " Foo
//  """
export const doubleDoubleDouble = {
	open: /^[\t ]*?"""/,
	close: /^[\t ]*?"""/,
	indent: /[\t "]*/
};

//  ##
//  # Foo
export const hashHash = {
	open: /^[\t ]*?##/,
	close: /^(?![\t ]*?#)/,
	indent: /[\t #]*/
};

//  ###
//  # Foo
//  ###
export const hashHashHash = {
	open: /^[\t ]*?###/,
	close: /^[\t ]*?###/,
	indent: /[\t #]*/
};

//  (**
//   * Foo
//   *)
export const parenStarStar = {
	open: /^[\t ]*?\(\*\*/,
	close: /\*\)/,
	indent: /[\t *]*/
};

//  %%
//  % Foo
export const percPerc = {
	open: /^[\t ]*?%%/,
	close: /^(?![\t ]*?%)/,
	indent: /[\t %]*/
};

//  %%%
//  % Foo
//  %%%
export const percPercPerc = {
	open: /^[\t ]*?%%%/,
	close: /^[\t ]*?%%%/,
	indent: /[\t %]*/
};

//  =pod
//  Foo
//  =cut
export const podCut = {
	open: /^=pod/,
	close: /^=cut/,
	indent: /[\t ]*/
};

//  ''
//  ' Foo
export const singleSingle = {
	open: /^[\t ]*?''/,
	close: /^(?![\t ]*?')/,
	indent: /[\t ']*/
};

//  '''
//  ' Foo
//  '''
export const singleSingleSingle = {
	open: /^[\t ]*?'''/,
	close: /^[\t ]*?'''/,
	indent: /[\t ']*/
};

//  /// Foo
//  /// Bar
//  /// Baz
export const slashSlashSlash = {
	open: /^(?=[\t ]*?\/\/\/)/,
	close: /^(?![\t ]*?\/\/)/,
	indent: /[\t /]*/
};

//  /**
//   * Foo
//   */
export const slashStarStar = {
	open: /^[\t ]*?\/\*\*/,
	close: /\*\//,
	indent: /[\t *]*/
};
